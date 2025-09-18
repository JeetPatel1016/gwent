export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  transformIgnorePatterns: ["node_modules/(?!(@gwent)/.*)"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.(js|ts)$": "$1",
    "^@gwent/(.*)$": "<rootDir>/../$1/src",
    "^@gwent/shared-types$": "<rootDir>/../shared-types/src",
    "^@gwent/card-data$": "<rootDir>/../card-data/src",
  },
  testMatch: ["**\/*.test.ts"],
};
