require("dotenv").config();
const path = require('path');

process.env.JEST_ENVIRONMENT == "qa"
  ? (module.exports = {      
      testEnvironment: "node",
      testTimeout: 180000,
      testMatch: [path.resolve(__dirname, '__tests__/**/*.js')],
      testPathIgnorePatterns: [
        path.resolve(__dirname, '__tests__/labs/quest_genetics.js')        
      ],
    })
  : process.env.JEST_ENVIRONMENT == "staging"
  ? (module.exports = {      
      testEnvironment: "node",
      testTimeout: 180000,
      testMatch: [path.resolve(__dirname, '__tests__/**/*.js')],
      testPathIgnorePatterns: [
      ],
    })
  : "ERROR: Environment not specified.";
