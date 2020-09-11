const fs = require("fs");
const path = require("path");

process.env.NODE_ENV = process.env.NODE_ENV || "development";
const parentPath = path.resolve(__dirname, "../");
const envFile = path.resolve(parentPath, ".env");
if (fs.existsSync(envFile)) {
  require("dotenv").config({ path: envFile });
}
