// Shared Tailwind class strings. Cream/peach = #FBEFE4, ink = #121528, gold = #8a6d2f.
export const display = "font-['Bodoni_Moda',serif]";
export const body = "font-['Jost',sans-serif]";
export const btn =
  "inline-block rounded-full bg-[#121528] px-8 py-3 text-[#F4F2F7] font-medium tracking-wide transition hover:bg-[#2a2f55] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6d2f]";
export const field =
  "w-full rounded-xl border border-[#121528]/20 bg-white px-4 py-3 text-[#121528] placeholder:text-[#121528]/40 focus:border-[#8a6d2f] focus:outline-none";
export const choice = (active) =>
  `rounded-xl border px-3 py-3 text-sm transition ${active ? "border-[#121528] bg-[#121528] text-[#F4F2F7]" : "border-[#121528]/25 text-[#121528] hover:border-[#121528]"}`;
