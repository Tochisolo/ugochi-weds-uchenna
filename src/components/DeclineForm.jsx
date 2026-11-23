import { useState } from "react";
import { saveGuest } from "../lib/api";
import { body, btn, field } from "../lib/styles";

export default function DeclineForm({ onDone }) {
  const [f, setF] = useState({ name: "", phone: "", note: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || f.phone.replace(/\D/g, "").length < 10) return setErr("Please enter your full name and a valid phone number.");
    setErr("");
    setBusy(true);
    try {
      onDone(await saveGuest({ name: f.name.trim(), phone: f.phone.trim(), note: f.note.trim(), attending: "no" }));
    } catch (e2) { setErr(e2.message); setBusy(false); }
  };

  return (
    <form onSubmit={submit} className={`${body} mx-auto mt-10 max-w-lg space-y-4 text-left`}>
      <p className="text-center text-[#4A4458]/70">Send your warm wishes from afar.</p>
      <input className={field} aria-label="Full name" placeholder="Full name" value={f.name} onChange={(e) => set("name", e.target.value)} />
      <input className={field} type="tel" aria-label="Phone number" placeholder="Phone number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
      <textarea className={`${field} min-h-32`} aria-label="Goodwill note" placeholder="A goodwill note to the couple"
        value={f.note} onChange={(e) => set("note", e.target.value)} />
      {err && <p role="alert" className="text-sm text-rose-700">{err}</p>}
      <button disabled={busy} className={`${btn} w-full disabled:opacity-60`}>{busy ? "Sending..." : "Send warm regards"}</button>
    </form>
  );
}