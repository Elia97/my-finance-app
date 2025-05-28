import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
const jestConfig = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"], // se hai file di setup
};

export default jestConfig;
