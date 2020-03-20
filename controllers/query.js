const VError = require("verror");
const db = require("../models");

module.exports = {
  all: async function (extraClause) {
    try {
      return await db.Task.findAll({
        attributes: {
          include: [
            [db.sequelize.fn("date_format", db.sequelize.col("Task.created_at"), "%Y-%m-%d"), "created_date"],
            [db.sequelize.fn("date_format", db.sequelize.col("Task.updated_at"), "%Y-%m-%d"), "updated_date"],
          ],
          exclude: ["created_at", "updated_at"],
        },
        include: [{
          model: db.Task,
          as: "subtask",
          attributes: ["id", "title", "is_completed"],
        }],
        order: [["id", "DESC"]],
        ...extraClause,
      });
    } catch (err) {
      const error = new VError("Failed to query all the data from Task table.");
      error.originalError = err;
      throw error;
    }
  },
}
