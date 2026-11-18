import ScheduleList from "../components/ScheduleList";
import { DATE_TEXT } from "../data/content";
import { body, display } from "../lib/styles";

export default function SchedulePage() {
  return (
    <section className="px-5 pb-24 pt-32 text-center">
      <p className={`${body} text-sm text-[#8a6d2f]`}>{DATE_TEXT}</p>
      <h1 className={`${display} mt-2 text-5xl`}>The Schedule</h1>
      <p className={`${body} mb-14 mt-3 text-[#4A4458]/70`}>An outline of the day so you know exactly where to be, and when.</p>
      <ScheduleList />
    </section>
  );
}
