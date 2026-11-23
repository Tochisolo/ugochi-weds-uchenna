// All talking to the server happens here.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function req(path, opts = {}) {
  let res;
  try {
    res = await fetch(BASE + path, { ...opts, headers: { "Content-Type": "application/json", ...opts.headers } });
  } catch {
    throw new Error("Couldn't reach the server. Please check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || "Something went wrong."), { status: res.status });
  return data;
}

export const saveGuest = (body) => req("/api/rsvp", { method: "POST", body: JSON.stringify(body) });
export const findByPhone = (phone) => req(`/api/rsvp/lookup?phone=${encodeURIComponent(phone.trim())}`);
export const getGuests = (key) => req("/api/admin/guests", { headers: { "x-admin-key": key } });
// code = scanned text or a Pass ID. undo = true reverses a check-in.
export const checkIn = (key, code, undo = false) =>
  req("/api/admin/checkin", { method: "POST", headers: { "x-admin-key": key }, body: JSON.stringify({ code, undo }) });