const VError = require("verror");
const db = require("../models");
const query = require("./query");

module.exports = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await query.all();
      res.json({
        tasks,
      });
    } catch (err) {
      const error = new VError("Failed to get all tasks.");
      error.originalError = err;
      throw error;
    }
  },
  addNewTask: async (req, res) => {
    try {
      const { title } = req.body;
      await db.Task.create({
        title,
      });
      const tasks = await query.all();
      res.json({
        tasks,
      });
    } catch (err) {
      const error = new VError("Failed to add a new task.");
      error.originalError = err;
      throw error;
    }
  },
  updateTask: async (req, res) => {
    try {
      const { id, title } = req.body;
      const task = await db.Task.findByPk(id);
      await task.update({
        title,
      });
      res.json({
        task,
      });
    } catch (err) {
      const error = new VError("Failed to update task title.");
      error.originalError = err;
      throw error;
    }
  },
};