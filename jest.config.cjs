/* eslint-disable @typescript-eslint/no-require-imports */
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/*.test.ts?(x)"],
  clearMocks: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  transformIgnorePatterns: [
    "node_modules/(?!(jose|@aws-sdk|another-esm-package)/)",
  ],
};
