import { driveId, driveUrl } from "../lib/drive";

// Photos can come from two places. Use either one, or both together:
//  1. Image files dropped into src/assets/gallery (picked up automatically, sorted by file name)
//  2. Google Drive links pasted into DRIVE_PHOTOS below (no image files in the project, nothing to push to GitHub)
const files = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
});
const local = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url);

// Paste Drive share links (or just the file IDs), one per line, in the order you want them shown.
// Every file must be shared as "Anyone with the link" (Viewer).
const DRIVE_PHOTOS = [
  // "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345/view?usp=sharing",
  // "1AbCdEfGhIjKlMnOpQrStUvWxYz012345",
];

DRIVE_PHOTOS.filter((v) => !driveId(v)).forEach((v) => console.warn("Gallery: not a valid Drive link or ID:", v));
const drive = [...new Set(DRIVE_PHOTOS.map((v) => driveUrl(v, 1600)).filter(Boolean))];

export const GALLERY_PHOTOS = [...local, ...drive];
// The grid shows smaller copies than the full-size viewer. Only Drive images are resized.
export const thumbOf = (url) => url.replace("&sz=w1600", "&sz=w600");
export const PAGE_SIZE = 12; // photos per page (divides evenly into 2, 3 and 4 columns)