import { useState } from "react";
import FindPass from "./FindPass";
import { saveGuest } from "../lib/storage";
import { body, btn, choice, field } from "../lib/styles";

// [value, label, number of extra named guests]. The partner needs no name.
const PARTIES = [
  ["couple", "Couple (me and my partner)", 0],
  ["couple1", "Couple + 1 guest", 1],
  ["couple2", "Couple + 2 guests", 2],
];

export default function AcceptForm({ onDone, onFound }) {
  const [f, setF] = useState({ first: "", last: "", email: "", phone: "", bringing: "", party: "couple", extras: ["", ""], request: "" });
  const [err, setErr] = useState("");
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const setExtra = (i, v) => setF((s) => ({ ...s, extras: s.extras.map((x, j) => (j === i ? v : x)) }));
  const extraCount = f.bringing === "yes" ? PARTIES.find((p) => p[0] === f.party)[2] : 0;

  const submit = (e) => {
    e.preventDefault();
    const extras = f.extras.slice(0, extraCount).map((x) => x.trim());
    if (!f.first.trim() || !f.last.trim() || !f.email.trim() || !f.phone.trim()) return setErr("Please fill in your name, email and phone number.");
    if (!f.bringing) return setErr("Please tell us whether you'll be bringing a guest.");
    if (extras.some((x) => !x)) return setErr("Please enter the name of each additional guest.");
    setErr("");
    const first = f.first.trim(), last = f.last.trim();
    onDone(saveGuest({
      name: `${first} ${last}`, first, last, email: f.email, phone: f.phone.trim(), attending: "yes",
      partner: f.bringing === "yes", extras, seats: f.bringing === "yes" ? 2 + extraCount : 1, request: f.request.trim(),
    }));
  };

  return (
    <form onSubmit={submit} className={`${body} mx-auto mt-10 max-w-lg space-y-4 text-left`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <input className={field} aria-label="First name" placeholder="First name" value={f.first} onChange={(e) => set("first", e.target.value)} />
        <input className={field} aria-label="Last name" placeholder="Last name" value={f.last} onChange={(e) => set("last", e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input className={field} type="email" aria-label="Email" placeholder="Email address" value={f.email} onChange={(e) => set("email", e.target.value)} />
        <input className={field} type="tel" aria-label="Phone number" placeholder="Phone number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>

      <div className="pt-2">
        <p className="text-base">Will you be bringing a guest?</p>
        <p className="mt-1 text-xs text-[#121528]/60">Adults Only - No children allowed, including infants</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[["yes", "Yes"], ["no", "No"]].map(([v, l]) => (
            <button type="button" key={v} aria-pressed={f.bringing === v} onClick={() => set("bringing", v)} className={choice(f.bringing === v)}>{l}</button>
          ))}
        </div>
      </div>

      {f.bringing === "yes" && (
        <div className="space-y-4 rounded-2xl border border-[#8a6d2f]/30 bg-white/60 p-4">
          <select className={field} aria-label="Number of guests" value={f.party} onChange={(e) => set("party", e.target.value)}>
            {PARTIES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
          {Array.from({ length: extraCount }, (_, i) => (
            <input key={i} className={field} aria-label={`Guest ${i + 1} full name`} placeholder={`Guest ${i + 1} full name`}
              value={f.extras[i]} onChange={(e) => setExtra(i, e.target.value)} />
          ))}
        </div>
      )}

      <textarea className={`${field} min-h-28`} aria-label="Special requests" placeholder="Special requests during the wedding (optional)"
        value={f.request} onChange={(e) => set("request", e.target.value)} />

      {err && <p role="alert" className="text-sm text-rose-700">{err}</p>}
      <button className={`${btn} w-full`}>Submit request &amp; generate entry pass</button>
      <FindPass onFound={onFound} />
    </form>
  );
}
