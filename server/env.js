import path from "path";
import dns from "node:dns";
import process from "node:process";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), ".env");
const result = dotenv.config({ path: file, quiet: true });

if (result.error) {
  console.warn(`No .env file at ${file} (${result.error.code}). Fine on a host that sets variables itself, otherwise create a file named exactly ".env" there.`);
} else {
  const names = Object.keys(result.parsed || {});
  console.log(`.env loaded. Variables found: ${names.length ? names.join(", ") : "none (the file is empty or not saved)"}`);
}

// Some ISPs/routers refuse the SRV lookup that mongodb+srv:// needs (error: querySrv ECONNREFUSED).
// Opt in on your own computer with DNS_SERVERS=8.8.8.8,1.1.1.1 in .env. Leave it out on your host.
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(",").map((s) => s.trim()).filter(Boolean));
  console.log("Using DNS servers:", dns.getServers().join(", "));
}