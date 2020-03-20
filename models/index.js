const Sequelize = require("sequelize");
const config = require("../config");

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
