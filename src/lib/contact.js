// Builds a link that opens a WhatsApp chat with the given number.
// "+234 801 234 5678", "2348012345678" and "0801 234 5678" all work.
export function whatsappLink(number, message = "") {
  let digits = String(number ?? "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "234" + digits.slice(1); // Nigerian local format
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}