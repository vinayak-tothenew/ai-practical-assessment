/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/../tests"],
  testMatch: ["**/integration/**/*.test.ts"],
  extensionsToTreatAsEsm: [".ts"],
  modulePaths: ["<rootDir>/node_modules"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", tsx: false },
          target: "es2022",
        },
        module: { type: "es6" },
      },
    ],
  },
  clearMocks: true,
};
