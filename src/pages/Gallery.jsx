import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Lightbox from "../components/LightBox";
import Pagination from "../components/Pagination";
import { GALLERY_INTRO } from "../data/content";
import { GALLERY_PHOTOS, PAGE_SIZE, thumbOf } from "../data/gallery";
import { body, display } from "../lib/styles";

export default function Gallery() {
  const [params, setParams] = useSearchParams(); // the page lives in the URL (?page=2), so Back works
  const [open, setOpen] = useState(null);        // index of the photo in the viewer, or null
  const gridRef = useRef(null);

  const total = GALLERY_PHOTOS.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(parseInt(params.get("page"), 10) || 1, 1), pages);
  const start = (page - 1) * PAGE_SIZE;
  const shown = GALLERY_PHOTOS.slice(start, start + PAGE_SIZE);

  const go = (p) => {
    setParams(p === 1 ? {} : { page: String(p) });
    gridRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="px-5 pb-24 pt-32">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className={`${display} text-5xl`}>Our Beautiful Moments</h1>
        <p className={`${body} mt-6 text-lg leading-8 text-[#4A4458]/85`}>{GALLERY_INTRO}</p>
      </div>

      <div ref={gridRef} className="mx-auto mt-14 max-w-6xl scroll-mt-40">
        {total === 0 ? (
          <p className={`${body} text-center text-[#4A4458]/70`}>Our photos are on their way. Please check back soon.</p>
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((src, i) => (
                <li key={src}>
                  <button type="button" onClick={() => setOpen(start + i)} aria-label={`Open photo ${start + i + 1}`}
                    className="group block w-full overflow-hidden rounded-2xl bg-[#8a6d2f]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6d2f]">
                    <img src={thumbOf(src)} alt={`Ugochi & Uchenna, moment ${start + i + 1}`} loading="lazy" decoding="async" referrerPolicy="no-referrer"
  className="aspect-4/5 w-full object-cover transition duration-500 group-hover:scale-105" />
                  </button>
                </li>
              ))}
            </ul>
            <p className={`${body} mt-6 text-center text-sm text-[#4A4458]/60`}>
              Photos {start + 1} to {start + shown.length} of {total}
            </p>
            <Pagination page={page} pages={pages} onChange={go} />
          </>
        )}
      </div>

      {open !== null && <Lightbox photos={GALLERY_PHOTOS} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}