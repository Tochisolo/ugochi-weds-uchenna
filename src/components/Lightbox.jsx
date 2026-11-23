import { useEffect, useRef } from "react";
import { body } from "../lib/styles";

// Full-size viewer. Arrow keys move through ALL photos (across pages), Esc closes.
export default function Lightbox({ photos, index, onChange, onClose }) {
  const closeRef = useRef(null);
  const total = photos.length;
  const step = (d) => onChange((index + d + total) % total);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onChange((index + 1) % total);
      else if (e.key === "ArrowLeft") onChange((index - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden"; // no scrolling behind the viewer
    closeRef.current?.focus();
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [index, total, onChange, onClose]);

  const nav = "absolute top-1/2 -translate-y-1/2 rounded-full bg-white/15 px-4 py-3 text-2xl text-[#E6E1DA] transition hover:bg-white/25";
  return (
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}
      className={`${body} fixed inset-0 z-60 flex items-center justify-center bg-[#121528]/92 p-4`}>
      <button ref={closeRef} type="button" aria-label="Close" onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/15 px-4 py-2 text-[#E6E1DA] transition hover:bg-white/25">Close</button>
      <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); step(-1); }} className={`${nav} left-3`}>‹</button>
      <img src={photos[index]} alt={`Ugochi & Uchenna, moment ${index + 1}`} referrerPolicy="no-referrer" onClick={(e) => e.stopPropagation()}
  className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl" />
      <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); step(1); }} className={`${nav} right-3`}>›</button>
      <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-[#E6E1DA]/80">{index + 1} / {total}</p>
    </div>
  );
}