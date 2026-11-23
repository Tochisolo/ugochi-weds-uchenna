import { useState } from "react";
import AcceptForm from "../components/AcceptForm";
import DeclineForm from "../components/DeclineForm";
import FindPass from "../components/FindPass";
import Pass from "../components/Pass";
import { DEADLINE } from "../data/content";
import { body, choice, display } from "../lib/styles";

export default function Rsvp() {
  const [mode, setMode] = useState(null); // null | "yes" | "no"
  const [result, setResult] = useState(null); // { type: "pass" | "declined", guest }

  const show = (guest) => setResult({ type: guest.attending === "yes" ? "pass" : "declined", guest });
  const first = result?.guest.name.split(" ")[0];

  if (result?.type === "pass")
    return (
      <section className="px-5 pb-20 pt-32 text-center">
        <h1 className={`${display} text-5xl`}>See you in Owerri, {first}.</h1>
        <p className={`${body} mx-auto mb-12 mt-3 max-w-md text-[#4A4458]/70`}>Your pass is ready. Download it and keep it on your phone.</p>
        <Pass guest={result.guest} />
        <FindPass onFound={show} />
      </section>
    );

  if (result?.type === "declined")
    return (
      <section className="px-5 pb-20 pt-32 text-center">
        <h1 className={`${display} text-5xl`}>Thank you, {first}.</h1>
        <p className={`${body} mx-auto mt-4 max-w-md text-[#4A4458]/70`}>Your warm wishes mean the world to us. We'll be thinking of you on the day.</p>
        <button onClick={() => setResult(null)} className={`${body} mt-10 text-sm underline underline-offset-4`}>Back to RSVP</button>
      </section>
    );

  return (
    <section className="px-5 pb-20 pt-32 text-center">
      <p className={`${body} text-sm text-[#8a6d2f]`}>Kindly respond on or before {DEADLINE}</p>
      <h1 className={`${display} mt-3 text-5xl`}>Will you be joining us?</h1>
      <div className={`${body} mx-auto mt-10 grid max-w-lg grid-cols-2 gap-3`} role="group" aria-label="Attendance">
        {[["yes", "Joyfully Accept"], ["no", "Regretfully Decline"]].map(([v, label]) => (
          <button type="button" key={v} aria-pressed={mode === v} onClick={() => setMode(v)} className={choice(mode === v)}>{label}</button>
        ))}
      </div>
      {mode === "yes" && <AcceptForm onDone={show} onFound={show} />}
      {mode === "no" && <DeclineForm onDone={show} />}
    </section>
  );
}
