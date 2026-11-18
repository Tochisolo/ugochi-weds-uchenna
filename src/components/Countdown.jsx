import useCountdown from "../hooks/useCountdown";
import { body, display } from "../lib/styles";

export default function Countdown() {
  const t = useCountdown();
  return (
    <div className={`${body} grid grid-cols-4 divide-x divide-[#8a6d2f]/30 rounded-2xl border border-[#8a6d2f]/30 bg-white/50 py-6 text-center`}>
      {Object.entries(t).map(([label, value]) => (
        <div key={label}>
          <p className={`${display} text-4xl tabular-nums text-[#121528] sm:text-6xl`}>{String(value).padStart(2, "0")}</p>
          <p className="mt-1 text-xs text-[#8a6d2f] sm:text-sm">{label}</p>
        </div>
      ))}
    </div>
  );
}
