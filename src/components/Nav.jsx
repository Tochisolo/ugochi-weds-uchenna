import { Link, NavLink } from "react-router-dom";
import { DEADLINE } from "../data/content";
import { body, display } from "../lib/styles";

const links = [["/", "Home"], ["/rsvp", "RSVP"], ["/gallery", "Gallery"], ["/schedule", "Schedule"]];

// The whole header is fixed and solid: a navy bar on top, then a cream nav bar beneath it.
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#8a6d2f]/20 bg-[#FBEFE4] text-[#4A4458] print:hidden">
      <div className={`${body} bg-[#121528] px-4 py-2 text-center text-sm text-[#E6E1DA]`}>
        Kindly respond on or before {DEADLINE} ·{" "}
        <Link to="/rsvp" className="font-semibold underline underline-offset-4">RSVP</Link>
      </div>
      <nav className={`${body} mx-auto flex max-w-6xl items-center justify-between px-5 py-4`}>
        <Link to="/" className={`${display} text-xl italic`}>Ugochi &amp; Uchenna</Link>
        <ul className="flex gap-4 text-sm sm:gap-6">
          {links.map(([to, label]) => (
            <li key={to}>
              <NavLink to={to} end
                className={({ isActive }) => `pb-1 transition hover:opacity-60 ${isActive ? "border-b border-[#4A4458]" : ""}`}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}