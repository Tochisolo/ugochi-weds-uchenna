import { DATE_TEXT, PLACE } from "../data/content";
import { body, display } from "../lib/styles";

export default function Footer() {
  return (
    <footer className={`${body} bg-[#121528] px-5 py-12 text-center text-[#E6E1DA]/80 print:hidden`}>
      <p className={`${display} text-2xl italic text-[#E6E1DA]`}>Ugochi &amp; Uchenna</p>
      <p className="mt-2 text-sm">{DATE_TEXT} · {PLACE}</p>
    </footer>
  );
}
