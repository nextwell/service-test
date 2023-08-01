const dotenv = require('dotenv');

['.env.local', '.env'].forEach(path => dotenv.config({ path }));

module.exports = {
  "collectCoverage": false,
  "coverageDirectory": "coverage",
  "coverageProvider": "v8",
  "coverageReporters": [
    "html",
    "text",
    "text-summary",
    "cobertura"
  ],
  "reporters": [
    "default",
    "jest-junit"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  },
  "collectCoverageFrom": [
    "{api,networking}/**/*.{js,mjs}"
  ],
  "testMatch": [
    "**/tests/**/*.test.[cm][tj]s?(x)"
  ],
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/.history/"
  ],
  "transform": {}
}
