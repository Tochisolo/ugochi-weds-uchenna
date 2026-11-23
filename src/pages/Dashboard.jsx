import { useCallback, useEffect, useState } from "react";
import CheckIn from "../components/dashboard/CheckIn";
import GuestTable from "../components/dashboard/GuestTable";
import Messages from "../components/dashboard/Messages";
import Stats from "../components/dashboard/Stats";
import { getGuests } from "../lib/api";
import { body, btn, display, field } from "../lib/styles";

const KEY = "uu-manager-key";
const ghost = "rounded-full border border-[#E6E1DA]/40 px-4 py-1.5 text-sm transition hover:bg-white/10";
const POLL_MS = 20000; // new responses and check-ins appear on their own

export default function Dashboard() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY) || "");
  const [input, setInput] = useState("");
  const [guests, setGuests] = useState([]);
  const [err, setErr] = useState("");
  const [updated, setUpdated] = useState(null);

  useEffect(() => { // keep this page out of search engines
    const m = Object.assign(document.createElement("meta"), { name: "robots", content: "noindex,nofollow" });
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  const signOut = () => { sessionStorage.removeItem(KEY); setKey(""); setGuests([]); };

  const load = useCallback(async () => {
    try {
      setGuests(await getGuests(key));
      setUpdated(new Date());
      setErr("");
    } catch (e) {
      if (e.status === 401) { signOut(); setErr("That access key isn't correct."); }
      else setErr("Couldn't reach the server. Retrying shortly.");
    }
  }, [key]);

  useEffect(() => {
    if (!key) return;
    load();
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [key, load]);

  const attending = guests.filter((g) => g.attending === "yes");
  const declined = guests.filter((g) => g.attending === "no");

  const exportCsv = () => {
    const rows = [["Pass ID", "Name", "Phone", "Seats", "Checked in", "Checked in at", "Received"],
      ...attending.map((g) => [g.id, g.name, g.phone, g.seats, g.checkedIn ? "Yes" : "No",
        g.checkedInAt ? new Date(g.checkedInAt).toLocaleString() : "", new Date(g.createdAt).toLocaleString()])];
    // A leading ' stops spreadsheet apps from treating guest-typed text as a formula.
    const cell = (c) => { const s = String(c ?? ""); return `"${(/^[=+\-@]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`; };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.map((r) => r.map(cell).join(",")).join("\n")], { type: "text/csv" }));
    a.download = "guest-list.csv";
    a.click();
  };

  if (!key)
    return (
      <div className={`${body} flex min-h-screen items-center justify-center bg-[#FBEFE4] px-5 text-[#4A4458]`}>
        <form onSubmit={(e) => { e.preventDefault(); sessionStorage.setItem(KEY, input.trim()); setKey(input.trim()); setInput(""); }}
          className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-[0_30px_80px_-30px_rgba(18,21,43,0.35)]">
          <p className={`${display} text-3xl italic`}>Ugochi &amp; Uchenna</p>
          <p className="mb-6 mt-1 text-sm text-[#4A4458]/70">Manager access</p>
          <input className={field} type="password" aria-label="Access key" placeholder="Access key" value={input} onChange={(e) => setInput(e.target.value)} />
          {err && <p role="alert" className="mt-3 text-sm text-rose-700">{err}</p>}
          <button className={`${btn} mt-5 w-full`}>Open dashboard</button>
        </form>
      </div>
    );

  return (
    <div className={`${body} min-h-screen bg-[#FBEFE4] text-[#4A4458]`}>
      <header className="bg-[#121528] px-5 py-4 text-[#E6E1DA]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className={`${display} text-xl italic`}>Ugochi &amp; Uchenna</p>
            <p className="text-xs opacity-70">Manager dashboard{updated && ` · updated ${updated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className={ghost}>Refresh</button>
            <button onClick={exportCsv} className={ghost}>Export CSV</button>
            <button onClick={signOut} className={ghost}>Sign out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-12 px-5 py-10">
        {err && <p role="alert" className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-800">{err}</p>}
        <Stats guests={guests} />
        <CheckIn adminKey={key} onChecked={load} />
        <GuestTable guests={attending} adminKey={key} onRefresh={load} />
        <Messages guests={declined} />
      </main>
    </div>
  );
}