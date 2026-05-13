import "dotenv/config";

import { exec } from "child_process";
import fs from "fs";
import path from "path";

const databaseUrl = process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error("POSTGRES_URL tidak ditemukan di .env");
  process.exit(1);
}

const backupDir = path.join(process.cwd(), ".backups");

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const date = new Date()
  .toISOString()
  .replace(/[:.]/g, "-");

const filename = path.join(
  backupDir,
  `backup-${date}.sql`
);

const command = `pg_dump "${databaseUrl}" > "${filename}"`;

console.log("Memulai backup database...");

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error("Backup gagal:");
    console.error(stderr || error.message);
    process.exit(1);
  }

  console.log("Backup berhasil:");
  console.log(filename);
});