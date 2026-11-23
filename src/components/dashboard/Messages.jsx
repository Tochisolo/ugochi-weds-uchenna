import { body, display } from "../../lib/styles";

export default function Messages({ guests }) {
  return (
    <section className={body}>
      <h2 className={`${display} mb-4 text-3xl`}>Goodwill messages</h2>
      {guests.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {guests.map((g) => (
            <article key={g.id} className="rounded-2xl border border-[#8a6d2f]/25 bg-white p-5">
              <p className="whitespace-pre-wrap leading-7">{g.note || <span className="text-[#4A4458]/50">No message left.</span>}</p>
              <p className="mt-4 font-semibold">{g.name}</p>
              <p className="text-xs text-[#4A4458]/70">{g.phone}</p>
            </article>
          ))}
        </div>
      ) : <p className="text-[#4A4458]/60">No messages yet.</p>}
    </section>
  );
}