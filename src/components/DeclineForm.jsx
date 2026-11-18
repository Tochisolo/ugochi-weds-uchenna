import { useState } from "react";
import { saveGuest } from "../lib/storage";
import { body, btn, field } from "../lib/styles";

export default function DeclineForm({ onDone }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", note: "" });
  const [err, setErr] = useState("");
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim() || !f.phone.trim()) return setErr("Please enter your full name, email and phone number.");
    setErr("");
    onDone(saveGuest({ ...f, name: f.name.trim(), phone: f.phone.trim(), note: f.note.trim(), attending: "no" }));
  };

  return (
    <form onSubmit={submit} className={`${body} mx-auto mt-10 max-w-lg space-y-4 text-left`}>
      <p className="text-center text-[#121528]/70">Send your warm wishes from afar.</p>
      <input className={field} aria-label="Full name" placeholder="Full name" value={f.name} onChange={(e) => set("name", e.target.value)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input className={field} type="email" aria-label="Email" placeholder="Email address" value={f.email} onChange={(e) => set("email", e.target.value)} />
        <input className={field} type="tel" aria-label="Phone number" placeholder="Phone number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>
      <textarea className={`${field} min-h-32`} aria-label="Goodwill note" placeholder="A goodwill note to the couple"
        value={f.note} onChange={(e) => set("note", e.target.value)} />
      {err && <p role="alert" className="text-sm text-rose-700">{err}</p>}
      <button className={`${btn} w-full`}>Send warm regards</button>
    </form>
  );
}
