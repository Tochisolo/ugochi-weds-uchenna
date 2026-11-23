import "./env.js"; // keep this first: loads .env before anything reads process.env
import crypto from "crypto";
import process from "node:process";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const { MONGO_URI, ADMIN_KEY, CLIENT_ORIGIN = "*", PORT = 5000 } = process.env;
const missing = ["MONGO_URI", "ADMIN_KEY"].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing ${missing.join(", ")}. Check the variable names listed above match exactly.`);
  process.exit(1);
}

/* ---------- Model ---------- */
const Guest = mongoose.model("Guest", new mongoose.Schema({
  passId: { type: String, unique: true },
  attending: { type: String, enum: ["yes", "no"], required: true },
  name: { type: String, required: true },
  phone: String,
  phoneKey: { type: String, required: true, unique: true, sparse: true }, // last 10 digits: one response per person
  partner: Boolean,
  seats: Number,
  note: String, // goodwill note (guests who decline)
  checkedIn: { type: Boolean, default: false },
  checkedInAt: Date,
}, { timestamps: true }));

const newPassId = () => "UU-" + crypto.randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
const clip = (v, n) => String(v ?? "").trim().slice(0, n);
// 08031234567 and +2348031234567 are the same person: compare the last 10 digits.
const phoneKeyOf = (p) => String(p ?? "").replace(/\D/g, "").slice(-10);
// What a guest may see about themselves: enough to show their pass, nothing more.
const publicView = (g) => ({ id: g.passId, name: g.name, attending: g.attending, seats: g.seats });
// What managers see.
const adminView = (g) => {
  const { passId, ...rest } = g.toObject();
  delete rest.phoneKey;
  delete rest._id;
  delete rest.__v;
  return { id: passId, ...rest };
};
const scanView = (g) => ({ id: g.passId, name: g.name, seats: g.seats, checkedInAt: g.checkedInAt });
// Accepts "UU-AB12CD", a scanner that dropped the hyphen, or an old JSON QR that contains the ID.
const passIdFrom = (code) => {
  const m = String(code ?? "").toUpperCase().match(/UU[\s_-]?([A-Z0-9]{6})/);
  return m ? `UU-${m[1]}` : null;
};

/* ---------- App ---------- */
const app = express();
// CLIENT_ORIGIN can hold several sites, separated by commas.
const allowedOrigins = CLIENT_ORIGIN.split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean);
console.log("CORS allowed origins:", CLIENT_ORIGIN === "*" ? "any" : allowedOrigins);
app.use(cors({
  origin(origin, cb) {
    if (!origin || CLIENT_ORIGIN === "*" || allowedOrigins.includes(origin)) return cb(null, true);
    console.warn(`CORS blocked origin: ${origin}`);
    cb(null, false);
  },
}));
app.use(express.json({ limit: "20kb" }));

// Catches errors in async routes so one bad request can't crash the server.
const safe = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    console.error(e);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  });

// Guests: submit a response. An accepted response is final (one per phone number).
// Someone who declined may still change their mind and accept.
app.post("/api/rsvp", safe(async (req, res) => {
  const b = req.body || {};
  const name = clip(b.name, 120);
  const phone = clip(b.phone, 40);
  const phoneKey = phoneKeyOf(phone);
  if (!name || phoneKey.length < 10 || !["yes", "no"].includes(b.attending))
    return res.status(400).json({ error: "Please check your name and phone number." });

  const existing = await Guest.findOne({ phoneKey });
  if (existing?.attending === "yes")
    return res.status(409).json({ error: b.attending === "yes"
      ? "This phone number has already accepted the invitation. Use \u201cFind my pass\u201d to get your pass again."
      : "This phone number has already accepted the invitation, so this response can't be changed here." });

  const yes = b.attending === "yes";
  const partner = yes && !!b.partner;
  const data = { attending: b.attending, name, phone, partner, seats: yes ? (partner ? 2 : 1) : 0, note: yes ? "" : clip(b.note, 1500) };
  try {
    const guest = await Guest.findOneAndUpdate(
      { phoneKey }, { $set: data, $setOnInsert: { passId: newPassId() } },
      { upsert: true, new: true, runValidators: true }
    );
    res.json(publicView(guest));
  } catch (e) {
    if (e.code !== 11000) throw e;
    res.status(409).json({ error: "A response with that phone number already exists. Use \u201cFind my pass\u201d to get your pass." });
  }
}));

// Guests: "Find my pass", by phone number.
app.get("/api/rsvp/lookup", safe(async (req, res) => {
  const phoneKey = phoneKeyOf(req.query.phone);
  const g = phoneKey.length === 10 ? await Guest.findOne({ phoneKey }) : null;
  if (!g) return res.status(404).json({ error: "We couldn't find a response with that phone number." });
  res.json(publicView(g));
}));

/* ---------- Managers only ---------- */
const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();
const requireAdmin = (req, res, next) =>
  crypto.timingSafeEqual(sha(req.get("x-admin-key") || ""), sha(ADMIN_KEY))
    ? next() : res.status(401).json({ error: "Unauthorized" });

app.get("/api/admin/guests", requireAdmin, safe(async (_req, res) => {
  res.json((await Guest.find().sort({ createdAt: -1 })).map(adminView));
}));

// Check-in. Used by the hardware scanner, the camera scanner and the manual button.
// body: { code, undo? }  ->  { status: "ok" | "already" | "undone", guest }
app.post("/api/admin/checkin", requireAdmin, safe(async (req, res) => {
  const passId = passIdFrom(req.body?.code);
  if (!passId) return res.status(400).json({ status: "invalid", error: "That code isn't a valid entry pass." });

  if (req.body?.undo) {
    const g = await Guest.findOneAndUpdate({ passId, attending: "yes" }, { $set: { checkedIn: false }, $unset: { checkedInAt: 1 } }, { new: true });
    return g ? res.json({ status: "undone", guest: scanView(g) })
             : res.status(404).json({ status: "notfound", error: "No guest found for that pass." });
  }

  // Atomic: if two scanners read the same pass at the same moment, only one of them wins.
  const g = await Guest.findOneAndUpdate(
    { passId, attending: "yes", checkedIn: { $ne: true } },
    { $set: { checkedIn: true, checkedInAt: new Date() } }, { new: true }
  );
  if (g) return res.json({ status: "ok", guest: scanView(g) });

  const existing = await Guest.findOne({ passId, attending: "yes" });
  if (!existing) return res.status(404).json({ status: "notfound", error: "No guest found for that pass." });
  res.json({ status: "already", guest: scanView(existing) });
}));

await mongoose.connect(MONGO_URI);
// Drops indexes the model no longer has (the old unique email index would block guests without email).
await Guest.syncIndexes().catch((e) => console.warn("syncIndexes:", e.message));
app.listen(PORT, () => console.log(`API running on :${PORT}`));