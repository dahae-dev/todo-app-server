const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const config = {
  username: process.env["DB_USER"],
  password: process.env["DB_PASSWORD"],
  database: process.env["DB_DATABASE"],
  host: process.env["DB_HOST"],
  dialect: "mysql",
  charset: "utf8",
  collate: "utf8_general_ci",
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
  timezone: "+09:00",
};

module.exports = config;
