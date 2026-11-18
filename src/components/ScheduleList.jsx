import { SCHEDULE } from "../data/content";
import { body, display } from "../lib/styles";

export default function ScheduleList() {
  return (
    <div className="mx-auto max-w-3xl text-left">
      <ol className="relative ml-3 border-l border-[#8a6d2f]/50 sm:ml-0 sm:border-l-0">
        {SCHEDULE.map((s) => (
          <li key={s.time} className="relative pb-12 pl-8 last:pb-0 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-8 sm:pl-0">
            <span className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full bg-[#8a6d2f] sm:hidden" />
            <p className={`${display} text-2xl text-[#8a6d2f] sm:pt-1 sm:text-right`}>{s.time}</p>
            <div className="sm:border-l sm:border-[#8a6d2f]/50 sm:pl-8">
              <h3 className={`${display} text-3xl text-[#121528]`}>{s.title}</h3>
              <p className={`${body} mt-2 max-w-md leading-relaxed text-[#121528]/70`}>{s.where}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
