import { useState } from "react";
import { findByEmail } from "../lib/storage";
import { body, btn, field } from "../lib/styles";

export default function FindPass({ onFound }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  const find = (e) => {
    e.preventDefault();
    const g = findByEmail(q);
    if (!g) return setErr("We couldn't find a response with that email. Check the spelling or RSVP again.");
    setErr("");
    onFound(g);
  };

  return (
    <div className={`${body} mt-8 text-center print:hidden`}>
      <button type="button" onClick={() => { setOpen(!open); setErr(""); }}
        className="text-sm text-[#121528]/70 underline underline-offset-4 hover:text-[#121528]">
        Already responded? Find my pass
      </button>
      {open && (
        <form onSubmit={find} className="mx-auto mt-4 max-w-sm space-y-3">
          <input className={field} type="email" aria-label="Email" placeholder="The email you RSVP'd with" value={q} onChange={(e) => setQ(e.target.value)} />
          {err && <p role="alert" className="text-sm text-rose-700">{err}</p>}
          <button className={`${btn} w-full`}>Find my pass</button>
        </form>
      )}
    </div>
  );
}
