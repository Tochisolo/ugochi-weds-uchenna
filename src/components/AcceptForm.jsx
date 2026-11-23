import { useState } from "react";
import FindPass from "./FindPass";
import { saveGuest } from "../lib/api";
import { body, btn, choice, field } from "../lib/styles";

export default function AcceptForm({ onDone, onFound }) {
  const [f, setF] = useState({ name: "", phone: "", bringing: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || f.phone.replace(/\D/g, "").length < 10) return setErr("Please enter your full name and a valid phone number.");
    if (!f.bringing) return setErr("Please tell us whether you'll be bringing a guest.");
    setErr("");
    setBusy(true);
    try {
      onDone(await saveGuest({ name: f.name.trim(), phone: f.phone.trim(), attending: "yes", partner: f.bringing === "yes" }));
    } catch (e2) { setErr(e2.message); setBusy(false); }
  };

  return (
    <form onSubmit={submit} className={`${body} mx-auto mt-10 max-w-lg space-y-4 text-left`}>
      <input className={field} aria-label="Full name" placeholder="Full name" value={f.name} onChange={(e) => set("name", e.target.value)} />
      <input className={field} type="tel" aria-label="Phone number" placeholder="Phone number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />

      <div className="pt-2">
        <p className="text-base">Will you be bringing a guest?</p>
        <p className="mt-1 text-xs text-[#4A4458]/60">Adults Only - No children allowed, including infants</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[["yes", "Yes"], ["no", "No"]].map(([v, l]) => (
            <button type="button" key={v} aria-pressed={f.bringing === v} onClick={() => set("bringing", v)} className={choice(f.bringing === v)}>{l}</button>
          ))}
        </div>
      </div>

      {f.bringing === "yes" && (
        <div className="rounded-2xl border border-[#8a6d2f]/30 bg-white/60 p-4">
          <select className={field} aria-label="Number of guests" defaultValue="couple">
            <option value="couple">My partner and I</option>
          </select>
        </div>
      )}

      {err && <p role="alert" className="text-sm text-rose-700">{err}</p>}
      <button disabled={busy} className={`${btn} w-full disabled:opacity-60`}>{busy ? "Sending..." : "Submit request & generate entry pass"}</button>
      <FindPass onFound={onFound} />
    </form>
  );
}