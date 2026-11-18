import { QRCodeSVG } from "qrcode.react";
import { DATE_TEXT, PLACE, HASHTAG } from "../data/content";
import { body, display, btn } from "../lib/styles";

export default function Pass({ guest }) {
  // This JSON is what the QR code holds. A door scanner can parse it.
  const payload = JSON.stringify({ id: guest.id, name: guest.name, seats: guest.seats, event: "UU2026" });
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl bg-white text-left text-[#121528] shadow-[0_30px_80px_-30px_rgba(18,21,43,0.35)] md:flex">
        <div className="flex-1 border-b border-dashed border-[#121528]/25 p-8 md:border-b-0 md:border-r">
          <p className={`${display} text-3xl italic`}>Ugochi &amp; Uchenna</p>
          <p className={`${body} mt-1 text-sm opacity-70`}>{DATE_TEXT} · {PLACE}</p>
          <dl className={`${body} mt-8 grid grid-cols-2 gap-y-5 text-sm`}>
            <div className="col-span-2"><dt className="opacity-60">Guest</dt><dd className={`${display} text-2xl`}>{guest.name}</dd></div>
            <div><dt className="opacity-60">Seats</dt><dd className="text-lg">{guest.seats}</dd></div>
            <div><dt className="opacity-60">Pass ID</dt><dd className="text-lg tracking-widest">{guest.id}</dd></div>
            <div><dt className="opacity-60">Church Service</dt><dd>12:00 PM</dd></div>
            <div><dt className="opacity-60">Reception</dt><dd>3:00 PM</dd></div>
          </dl>
          <p className={`${body} mt-8 text-xs opacity-60`}>{HASHTAG}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 bg-[#FBEFE4] p-8 md:w-64">
          <div className="rounded-2xl bg-white p-3 ring-1 ring-[#8a6d2f]/60">
            <QRCodeSVG value={payload} size={160} level="M" fgColor="#121528" />
          </div>
          <p className={`${body} text-center text-xs opacity-70`}>Show this code at the entrance</p>
        </div>
        {/* ticket notches (same color as the page) */}
        <span className="absolute -top-3 left-[calc(100%-16rem-12px)] hidden h-6 w-6 rounded-full bg-[#FBEFE4] md:block" />
        <span className="absolute -bottom-3 left-[calc(100%-16rem-12px)] hidden h-6 w-6 rounded-full bg-[#FBEFE4] md:block" />
      </div>
      <div className="mt-6 flex justify-center print:hidden">
        <button onClick={() => window.print()} className={`${btn} ${body}`}>Save or print pass</button>
      </div>
    </div>
  );
}
