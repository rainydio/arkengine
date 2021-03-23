/* eslint-disable  */

module.exports = {
	testMatch: ["<rootDir>/dist/**/*.test.js"],
	testEnvironment: "node",
	setupFiles: ["<rootDir>/../../jest.reflect-metadata.js"],
	coverageDirectory: "<rootDir>/../../report/coverage",
	collectCoverageFrom: ["<rootDir>/dist/**/*.js"],
	watchPathIgnorePatterns: ["^<rootDir>/src/.+?.ts$"],
};
