const VError = require("verror");
const moment = require("moment");
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
  counts: async function () {
    try {
      const all = await db.Task.count(await this.current("all"));
      const today = await db.Task.count(await this.current("today"));
      const complete = await db.Task.count(await this.current("complete"));
      const incomplete = await db.Task.count(await this.current("incomplete"));
      return {
        all,
        today,
        complete,
        incomplete,
      }
    } catch (err) {
      const error = new VError("Failed to query total counts.");
      error.originalError = err;
      throw error;
    }
  },
  current: function (queryString = "") {
    let whereClause = {};
    switch (queryString) {
      case "today":
        whereClause = {
          where: {
            due_date: moment().startOf("day").format("YYYY-MM-DD"),
          }
        };
        break;
      case "complete":
        whereClause = {
          where: {
            is_completed: true,
          }
        };
        break;
      case "incomplete":
        whereClause = {
          where: {
            is_completed: false,
          }
        };
        break;
      default:
        whereClause = {};
    }
    return whereClause;
  }
}
