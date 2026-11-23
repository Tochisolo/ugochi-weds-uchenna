// Turns a Google Drive share link (or a bare file ID) into an address an <img> can display.
// The file must be shared as "Anyone with the link".
export const driveId = (v) => {
  const s = String(v ?? "").trim();
  return (s.match(/\/d\/([\w-]{10,})/) || s.match(/[?&]id=([\w-]{10,})/) || s.match(/^([\w-]{10,})$/) || [])[1] || null;
};

export const driveUrl = (v, width = 1600) => {
  const id = driveId(v);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${width}` : null;
};