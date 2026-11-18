// Browser-only storage. Replace these functions with calls to your Express/MongoDB API.
const KEY = "uu-rsvps";

export const getAll = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
export const saveAll = (list) => {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
};
export const findByEmail = (email) =>
  getAll().find((g) => g.email.toLowerCase() === email.trim().toLowerCase());
export const makeId = () => "UU-" + Math.random().toString(36).slice(2, 8).toUpperCase();

// Create or update a guest (matched by email) and return the saved record.
export function saveGuest(form) {
  const existing = findByEmail(form.email);
  const guest = { ...existing, ...form, name: form.name.trim(), email: form.email.trim(), id: existing?.id || makeId() };
  saveAll([...getAll().filter((g) => g.id !== guest.id), guest]);
  return guest;
}
