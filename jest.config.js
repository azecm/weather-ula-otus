/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  coverageReporters: ["json", "json-summary", "text", "lcov"],
  coverageThreshold: {
    global: {
      lines: 100,
      statements: 97.75,
      branches: 82.14,
      functions: 100,
    },
  },

  clearMocks: true,

  globals: {
    window: {},
    jest: true,
  },

  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
  },

  testEnvironment: "jsdom",

};

module.exports = config;
