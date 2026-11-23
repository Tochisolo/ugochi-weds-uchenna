import { body } from "../lib/styles";

// 1 … 4 5 6 … 10
const pageList = (page, pages) => {
  const keep = new Set([1, pages, page - 1, page, page + 1]);
  const out = [];
  let prev = 0;
  for (let p = 1; p <= pages; p++) {
    if (!keep.has(p)) continue;
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
};

const base = "min-w-10 rounded-full border px-3 py-2 text-sm transition disabled:opacity-40";

export default function Pagination({ page, pages, onChange }) {
  if (pages < 2) return null;
  return (
    <nav aria-label="Gallery pages" className={`${body} mt-12 flex flex-wrap items-center justify-center gap-2`}>
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}
        className={`${base} border-[#4A4458]/25 hover:border-[#4A4458]`}>Previous</button>
      {pageList(page, pages).map((p, i) =>
        p === "…" ? <span key={`gap${i}`} className="px-1 text-[#4A4458]/50">…</span> : (
          <button type="button" key={p} onClick={() => onChange(p)} aria-current={p === page ? "page" : undefined}
            className={`${base} ${p === page ? "border-[#121528] bg-[#121528] text-[#E6E1DA]" : "border-[#4A4458]/25 hover:border-[#4A4458]"}`}>{p}</button>
        ))}
      <button type="button" disabled={page === pages} onClick={() => onChange(page + 1)}
        className={`${base} border-[#4A4458]/25 hover:border-[#4A4458]`}>Next</button>
    </nav>
  );
}