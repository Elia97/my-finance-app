/// <reference types="jest" />
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const prisma = new PrismaClient();

beforeAll(async () => {
  try {
    console.log("🧨 Resetting test DB...");
    execSync(
      "npx prisma migrate reset --force --schema=./prisma/schema.prisma",
      {
        stdio: "inherit",
      }
    );
    console.log("✅ Test DB reset complete");
  } catch (error) {
    console.error("❌ Failed to reset test DB:", error);
    process.exit(1);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
