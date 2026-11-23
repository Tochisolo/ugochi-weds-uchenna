import { useCallback, useRef, useState } from "react";
import CameraScanner from "./CameraScanner";
import HardwareScanner from "./HardwareScanner";
import { checkIn } from "../../lib/api";
import { body, choice, display } from "../../lib/styles";

const COOLDOWN_MS = 3000;
const clock = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const TITLE = { ok: "Checked in", already: "Already checked in", notfound: "Pass not found", invalid: "Not a valid pass", error: "Couldn't check in" };
const TONE = {
  ok: "border-emerald-300 bg-emerald-50 text-emerald-900",
  already: "border-amber-300 bg-amber-50 text-amber-900",
  notfound: "border-rose-300 bg-rose-50 text-rose-900",
  invalid: "border-rose-300 bg-rose-50 text-rose-900",
  error: "border-rose-300 bg-rose-50 text-rose-900",
};

function beep(ok) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = ok ? 880 : 220;
    gain.gain.value = 0.08;
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + (ok ? 0.12 : 0.3));
    osc.onended = () => ctx.close();
  } catch { /* sound is optional */ }
}

function Result({ r }) {
  return (
    <div className={`rounded-2xl border p-5 ${TONE[r.status]}`} role="status">
      <p className={`${display} text-2xl`}>{TITLE[r.status]}</p>
      {r.guest ? (
        <>
          <p className="mt-1 text-lg font-semibold">{r.guest.name}</p>
          <p className="text-sm">{r.guest.seats} seat{r.guest.seats > 1 ? "s" : ""} · {r.guest.id}</p>
          {r.status === "already" && r.guest.checkedInAt && <p className="mt-1 text-sm">First checked in at {clock(r.guest.checkedInAt)}</p>}
        </>
      ) : <p className="mt-1 text-sm">{r.message}</p>}
    </div>
  );
}

// Only ONE scanner is mounted at a time, so a hardware scanner and the camera can never fight over input.
// Both feed the same handler, which handles one scan at a time and ignores repeats of the same code.
export default function CheckIn({ adminKey, onChecked }) {
  const [mode, setMode] = useState("hardware"); // "hardware" | "camera"
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState([]);
  const busy = useRef(false);
  const last = useRef({ code: "", at: 0 });

  const handleScan = useCallback(async (raw) => {
    const code = String(raw ?? "").trim();
    const now = Date.now();
    if (!code || busy.current || (code === last.current.code && now - last.current.at < COOLDOWN_MS)) return;
    busy.current = true;
    last.current = { code, at: now };
    let r;
    try {
      const out = await checkIn(adminKey, code);
      r = { status: out.status, guest: out.guest };
    } catch (e) {
      r = { status: e.status === 404 ? "notfound" : e.status === 400 ? "invalid" : "error", message: e.message };
    }
    busy.current = false;
    r.at = new Date();
    setResult(r);
    setRecent((list) => [r, ...list].slice(0, 6));
    beep(r.status === "ok");
    if (r.status === "ok") onChecked();
  }, [adminKey, onChecked]);

  return (
    <section className={body}>
      <h2 className={`${display} mb-4 text-3xl`}>Check-in</h2>
      <div className="grid gap-6 rounded-2xl border border-[#8a6d2f]/25 bg-white p-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Scanner type">
            <button type="button" aria-pressed={mode === "hardware"} onClick={() => setMode("hardware")} className={choice(mode === "hardware")}>Hardware scanner</button>
            <button type="button" aria-pressed={mode === "camera"} onClick={() => setMode("camera")} className={choice(mode === "camera")}>Phone or webcam</button>
          </div>
          {mode === "hardware" ? <HardwareScanner onScan={handleScan} /> : <CameraScanner onScan={handleScan} />}
        </div>
        <div className="space-y-4">
          {result ? <Result r={result} /> : <p className="text-[#4A4458]/60">Scan a pass and the result shows here.</p>}
          {recent.length > 1 && (
            <ul className="space-y-1 text-sm text-[#4A4458]/70">
              {recent.slice(1).map((r, n) => (
                <li key={n}>{clock(r.at)} · {TITLE[r.status]}{r.guest ? `: ${r.guest.name}` : ""}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}