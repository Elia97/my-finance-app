/// <reference types="jest" />
import { execSync } from "child_process";

beforeAll(() => {
  execSync("npx prisma db push --force-reset --schema=./prisma/schema.prisma");
});
