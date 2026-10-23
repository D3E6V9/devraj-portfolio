import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
const prisma = new PrismaClient();

async function main() {
  // The reference HTML only contains demo lessons and placeholder video URLs.
  // Seed no invented or publicly visible learning content.
  await prisma.siteSetting.upsert({ where: { key: "youtubeChannelUrl" }, update: {}, create: { key: "youtubeChannelUrl", value: process.env.YOUTUBE_CHANNEL_URL ?? "" } });
  await prisma.siteSetting.upsert({ where: { key: "creatorBio" }, update: {}, create: { key: "creatorBio", value: "" } });
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (email && password) {
    if (password.length < 14) throw new Error("ADMIN_BOOTSTRAP_PASSWORD must be at least 14 characters.");
    const salt = randomBytes(16).toString("hex");
    const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
    await prisma.adminUser.upsert({ where: { email }, update: { passwordHash }, create: { email, passwordHash } });
    console.log(`Administrator ${email} is initialized or updated.`);
  } else {
    console.log("No administrator created; set ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD before seeding to create one.");
  }
  console.log("UpShift site settings are ready; no placeholder courses were published.");
}
main().finally(() => prisma.$disconnect());
