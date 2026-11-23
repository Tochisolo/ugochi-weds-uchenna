import { useState } from "react";
import { findByPhone } from "../lib/api";
import { body, btn, field } from "../lib/styles";

// Deliberately NOT a <form>: this component sits inside the RSVP <form>, and nested forms
// make a click here also fire the RSVP form's own submit.
export default function FindPass({ onFound }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const find = async () => {
    if (q.replace(/\D/g, "").length < 10) return setErr("Please enter the phone number you RSVP'd with.");
    setBusy(true);
    try {
      const g = await findByPhone(q);
      setErr("");
      onFound(g);
    } catch (e) {
      setErr(e.status === 404 ? "We couldn't find a response with that phone number. Check it and try again, or RSVP." : e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`${body} mt-8 text-center print:hidden`}>
      <button type="button" onClick={() => { setOpen(!open); setErr(""); }}
        className="text-sm text-[#4A4458]/70 underline underline-offset-4 hover:text-[#4A4458]">
        Already responded? Find my pass
      </button>
      {open && (
        <div className="mx-auto mt-4 max-w-sm space-y-3">
          <input className={field} type="tel" aria-label="Phone number" placeholder="The phone number you RSVP'd with" value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); find(); } }} />
          {err && <p role="alert" className="text-sm text-rose-700">{err}</p>}
          <button type="button" onClick={find} disabled={busy} className={`${btn} w-full disabled:opacity-60`}>
            {busy ? "Searching..." : "Find my pass"}
          </button>
        </div>
      )}
    </div>
  );
}