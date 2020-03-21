const VError = require("verror");
const db = require("../models");
const query = require("./query");

module.exports = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await query.all();
      const totalCounts = await query.counts();
      res.json({
        tasks,
        totalCounts,
      });
    } catch (err) {
      const error = new VError("Failed to get all tasks.");
      error.originalError = err;
      throw error;
    }
  },
  getTasksPerPage: async (req, res) => {
    try {
      const { pageNum } = req.params;
      const tasks = await query.pagination(pageNum);
      const totalCounts = await query.counts();
      const count = await db.Task.count();
      res.json({
        tasks,
        totalCounts,
        count,
      });
    } catch (err) {
      const error = new VError("Failed to get tasks per page.");
      error.originalError = err;
      throw error;
    }
  },
  getSearchTasks: async (req, res) => {
    try {
      const { queryString, pageNum } = req.params;
      const whereClause = await query.current("search", queryString);
      const tasks = await query.pagination(pageNum, whereClause);
      const count = await db.Task.count(whereClause);
      res.json({
        tasks,
        count,
      });
    } catch (err) {
      const error = new VError("Failed to search tasks.");
      error.originalError = err;
      throw error;
    }
  },
  getFilteredTasks: async (req, res) => {
    try {
      const { queryString, pageNum } = req.params;
      const whereClause = await query.current("filter", queryString);
      const tasks = await query.pagination(pageNum, whereClause);
      const count = await db.Task.count(whereClause);
      res.json({
        tasks,
        count,
      });
    } catch (err) {
      const error = new VError("Failed to filter tasks.");
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
      const tasks = await query.all({
        limit: 5,
      })
      const totalCounts = await query.counts();
      res.json({
        tasks,
        totalCounts,
      });
    } catch (err) {
      const error = new VError("Failed to add a new task.");
      error.originalError = err;
      throw error;
    }
  },
  addSubtask: async (req, res) => {
    try {
      const { title, parent_id, pageNum } = req.body;
      await db.Task.create({
        title,
        parent_id,
      });
      const tasks = await query.pagination(pageNum);
      const totalCounts = await query.counts();
      const count = await db.Task.count();
      res.json({
        tasks,
        totalCounts,
        count,
      });
    } catch (err) {
      const error = new VError("Failed to add a subtask.");
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
  updateComplete: async (req, res) => {
    try {
      const { id, is_completed, pageNum, page, queryString } = req.body;
      const task = await db.Task.findByPk(id);
      await task.update({
        is_completed,
      })
      const whereClause = await query.current(page, queryString);
      const tasks = await query.pagination(pageNum, whereClause);
      const totalCounts = await query.counts();
      const count = await db.Task.count(whereClause);
      res.json({
        tasks,
        totalCounts,
        count,
      });
    } catch (err) {
      const error = new VError("Failed to update the task complete.");
      error.originalError = err;
      throw error;
    }
  },
  updateDuedate: async (req, res) => {
    try {
      const { id, due_date, pageNum, page, queryString } = req.body;
      const task = await db.Task.findByPk(id);
      await task.update({
        due_date,
      })
      const whereClause = await query.current(page, queryString);
      const tasks = await query.pagination(pageNum, whereClause);
      const totalCounts = await query.counts();
      const count = await db.Task.count(whereClause);
      res.json({
        tasks,
        totalCounts,
        count,
      });
    } catch (err) {
      const error = new VError("Failed to save the due date.");
      error.originalError = err;
      throw error;
    }
  },
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { pageNum, page, queryString } = req.body;
      const task = await db.Task.findByPk(id);
      await task.destroy();
      const whereClause = await query.current(page, queryString);
      const tasks = await query.pagination(pageNum);
      const totalCounts = await query.counts();
      const count = await db.Task.count(whereClause);
      console.log(count)
      res.json({
        tasks,
        totalCounts,
        count,
      });
    } catch (err) {
      const error = new VError("Failed to delete the task.");
      error.originalError = err;
      throw error;
    }
  },
};