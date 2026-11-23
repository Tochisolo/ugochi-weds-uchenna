import { body, display } from "../../lib/styles";

export default function Stats({ guests }) {
  const yes = guests.filter((g) => g.attending === "yes");
  const seats = (list) => list.reduce((n, g) => n + (g.seats || 0), 0);
  const arrived = yes.filter((g) => g.checkedIn);
  const people = seats(yes);
  const peopleIn = seats(arrived);
  const pct = people ? Math.round((peopleIn / people) * 100) : 0;

  const cards = [
    ["Checked in", `${peopleIn} / ${people}`, `People arrived (${pct}%)`],
    ["Passes scanned", `${arrived.length} / ${yes.length}`, "Of the accepted invitations"],
    ["Still expected", people - peopleIn, "People yet to arrive"],
    ["Declined", guests.length - yes.length, "Sent regrets"],
  ];
  return (
    <div className={`${body} grid grid-cols-2 gap-4 lg:grid-cols-4`}>
      {cards.map(([label, value, hint], i) => (
        <div key={label} className="rounded-2xl border border-[#8a6d2f]/25 bg-white p-5">
          <p className="text-sm text-[#8a6d2f]">{label}</p>
          <p className={`${display} mt-1 text-4xl`}>{value}</p>
          <p className="mt-1 text-xs text-[#4A4458]/60">{hint}</p>
          {i === 0 && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#8a6d2f]/15">
              <div className="h-full rounded-full bg-[#8a6d2f] transition-all" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}