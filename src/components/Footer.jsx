import { CONTACT_MESSAGE, CONTACT_NUMBER, COPYRIGHT_NAME, DATE_TEXT, PLACE } from "../data/content";
import { whatsappLink } from "../lib/contact";
import { body, display } from "../lib/styles";

export default function Footer() {
  return (
    <footer className={`${body} bg-[#121528] px-5 py-12 text-center text-[#E6E1DA]/80 print:hidden`}>
      <p className={`${display} text-2xl italic text-[#E6E1DA]`}>Ugochi &amp; Uchenna</p>
      <p className="mt-2 text-sm">{DATE_TEXT} · {PLACE}</p>

      <div className="mx-auto my-8 h-px w-16 bg-[#E6E1DA]/30" aria-hidden="true" />

      <p className="text-xs text-[#E6E1DA]/60">© {new Date().getFullYear()} {COPYRIGHT_NAME}. All rights reserved.</p>
      <p className="mt-3 text-sm">
        <a href={whatsappLink(CONTACT_NUMBER, CONTACT_MESSAGE)} target="_blank" rel="noopener noreferrer"
          aria-label={`Chat with us on WhatsApp at ${CONTACT_NUMBER}`}
          className="underline-offset-4 transition hover:text-[#E6E1DA] hover:underline">
          Contact us @ {CONTACT_NUMBER}
        </a>
      </p>
    </footer>
  );
}