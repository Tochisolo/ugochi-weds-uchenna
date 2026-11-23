import { useState } from "react";
import { checkIn } from "../../lib/api";
import { body, display, field } from "../../lib/styles";

const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const clock = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function GuestTable({ guests, adminKey, onRefresh }) {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState("");
  const rows = guests.filter((g) => [g.id, g.name, g.phone].join(" ").toLowerCase().includes(q.trim().toLowerCase()));

  // Manual fallback: mark someone in (or undo a mistake) without scanning.
  const toggle = async (g) => {
    setBusy(g.id);
    try { await checkIn(adminKey, g.id, g.checkedIn); } catch { /* the refreshed list shows the outcome */ }
    await onRefresh();
    setBusy("");
  };

  return (
    <section className={body}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className={`${display} text-3xl`}>Guest list</h2>
        <input className={`${field} max-w-xs`} aria-label="Search guests" placeholder="Search name, phone or pass ID"
          value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#8a6d2f]/25 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[#8a6d2f]/25 text-[#8a6d2f]">
            <tr>{["Pass ID", "Guest", "Phone", "Seats", "Check-in", "Received"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((g) => (
              <tr key={g.id} className="border-b border-[#4A4458]/10 align-top last:border-0">
                <td className="px-4 py-3 font-semibold tracking-widest">{g.id}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{g.name}</p>
                  {g.partner && <p className="text-xs text-[#4A4458]/70">+ partner</p>}
                </td>
                <td className="px-4 py-3">{g.phone}</td>
                <td className="px-4 py-3">{g.seats}</td>
                <td className="px-4 py-3">
                  {g.checkedIn
                    ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">In at {clock(g.checkedInAt)}</span>
                    : <span className="rounded-full bg-[#4A4458]/10 px-2 py-0.5 text-xs">Not yet</span>}
                  <button onClick={() => toggle(g)} disabled={busy === g.id}
                    className="mt-1 block text-xs underline underline-offset-2 disabled:opacity-50">
                    {busy === g.id ? "Saving..." : g.checkedIn ? "Undo" : "Check in"}
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#4A4458]/70">{fmt(g.createdAt)}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-[#4A4458]/60">No guests to show yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}