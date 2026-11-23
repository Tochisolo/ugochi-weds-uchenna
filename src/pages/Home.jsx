import { Link } from "react-router-dom";
import Countdown from "../components/Countdown";
import ScheduleList from "../components/ScheduleList";
import HeroCarousel from "../components/HeroCarousel";
import { DATE_TEXT, PLACE, DEADLINE, HASHTAG, MESSAGE } from "../data/content";
import { body, btn, display } from "../lib/styles";

export default function Home() {
  return (
    <>
      {/* Hero + countdown share one cream background */}
      <div className="bg-[#FBEFE4] pb-24">
        <section className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-14 pt-32 text-center">
          <HeroCarousel />
          <h1 className={`${display} mt-10 text-5xl italic leading-tight sm:text-6xl`}>Ugochi &amp; Uchenna</h1>
          <p className={`${body} mt-4 text-lg`}>{DATE_TEXT}</p>
          <p className={`${body} mt-1 text-lg`}>{PLACE}</p>
          <p className={`${body} mt-4 text-sm text-[#4A4458]/70`}>Kindly respond on or before {DEADLINE}</p>
          <Link to="/rsvp" className={`${btn} ${body} mt-8`}>RSVP</Link>
        </section>
        <section className="mx-auto max-w-4xl px-5"><Countdown /></section>
      </div>

      <section className="bg-white px-5 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className={`${display} text-4xl`}>We can't wait to celebrate with you.</h2>
          <p className={`${body} mt-8 text-lg leading-8 text-[#4A4458]/80`}>{MESSAGE}</p>
          <p className={`${body} mt-8 text-[#8a6d2f]`}>{HASHTAG}</p>
          <p className={`${body} mt-1 text-sm text-[#4A4458]/60`}>{DATE_TEXT}</p>
        </div>
      </section>

      <section className="bg-[#FBEFE4] px-5 py-24 text-center">
        <p className={`${body} text-sm text-[#8a6d2f]`}>{DATE_TEXT}</p>
        <h2 className={`${display} mt-2 text-4xl`}>The Schedule</h2>
        <p className={`${body} mb-14 mt-3 text-[#4A4458]/70`}>An outline of the day so you know exactly where to be, and when.</p>
        <ScheduleList />
      </section>
    </>
  );
}
