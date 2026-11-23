import { useEffect, useRef, useState } from "react";
import { body, btn, field } from "../../lib/styles";

// Handheld/USB scanners act like a keyboard: they type the code, then press Enter.
// This keeps the box focused so a scan is never missed, without stealing keys from other inputs.
export default function HardwareScanner({ onScan }) {
  const ref = useRef(null);
  const [value, setValue] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ref.current?.focus();
    const regrab = (e) => {
      const el = document.activeElement;
      const inOtherField = el && el !== ref.current && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
      if (!inOtherField && el !== ref.current && !e.ctrlKey && !e.metaKey && !e.altKey) ref.current?.focus();
    };
    window.addEventListener("keydown", regrab);
    return () => window.removeEventListener("keydown", regrab);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const code = value;
    setValue("");
    onScan(code);
  };

  return (
    <form onSubmit={submit} className={`${body} space-y-3`}>
      <p className={`text-sm ${ready ? "text-emerald-700" : "text-amber-700"}`}>
        {ready ? "Ready: point the scanner at a pass." : "Click the box below to start scanning."}
      </p>
      <div className="flex gap-3">
        <input ref={ref} className={field} value={value} onChange={(e) => setValue(e.target.value)}
          onFocus={() => setReady(true)} onBlur={() => setReady(false)}
          autoComplete="off" aria-label="Scan a pass" placeholder="Scan a pass, or type the Pass ID and press Enter" />
        <button className={`${btn} shrink-0`}>Check in</button>
      </div>
    </form>
  );
}