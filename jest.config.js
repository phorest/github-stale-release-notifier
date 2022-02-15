"use strict";

module.exports = {
    resetMocks: true,
    testEnvironment: "node",
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
        },
    },
    coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
};
