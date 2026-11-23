import { useEffect, useState } from "react";
import { HERO, PHOTOS, SLIDE_MS } from "../data/content";

export default function HeroCarousel() {
  const [failed, setFailed] = useState([]);
  const [i, setI] = useState(0);
  const slides = PHOTOS.filter((p) => !failed.includes(p));
  const list = slides.length ? slides : [HERO]; // original photo if none of the new ones load
  const current = i % list.length;

  useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setI((n) => n + 1), SLIDE_MS);
    return () => clearInterval(t);
  }, [list.length]);

  return (
    <div className="w-full max-w-sm">
      <div className="group rounded-t-full border border-[#8a6d2f]/50 p-3">
        <div className="overflow-hidden rounded-t-full">
          <div className="relative aspect-3/4 w-full transition-transform duration-700 ease-out group-hover:scale-105">
            {list.map((src, n) => (
              <img key={src} src={src} alt={`Ugochi & Uchenna, photo ${n + 1} of ${list.length}`} referrerPolicy="no-referrer"
                onError={() => setFailed((f) => (f.includes(src) ? f : [...f, src]))}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${n === current ? "opacity-100" : "opacity-0"}`} />
            ))}
          </div>
        </div>
      </div>
      {list.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {list.map((_, n) => (
            <button key={n} type="button" aria-label={`Show photo ${n + 1}`} onClick={() => setI(n)}
              className={`h-2 w-2 rounded-full transition ${n === current ? "bg-[#8a6d2f]" : "bg-[#8a6d2f]/30"}`} />
          ))}
        </div>
      )}
    </div>
  );
}