const VError = require("verror");
const readXlsxFile = require("read-excel-file/node");
const db = require("../models");
const query = require("./query");

module.exports = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await query.all({
        order: [["id", "ASC"]],
      });
      const totalCounts = await query.counts();
      res.json({
        tasks,
        totalCounts,
      });
    } catch (err) {
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
      console.log(err);
      const error = new VError("Failed to add a new task.");
      error.originalError = err;
      throw error;
    }
  },
  addSubtask: async (req, res) => {
    try {
      const { title, parent_id, pageNum } = req.body;
      const existingSubtask = await query.all({
        where: {
          title,
        }
      })
      if (!!existingSubtask.length) {
        const subtask = await existingSubtask[0].update({
          parent_id,
        });
        if (!subtask.is_completed) {
          await query.updateAncestors(subtask);
        }
      } else {
        const subtask = await db.Task.create({
          title,
          parent_id,
        });
        await query.updateAncestors(subtask);
      }
      const tasks = await query.pagination(pageNum);
      const totalCounts = await query.counts();
      const count = await db.Task.count();
      res.json({
        tasks,
        totalCounts,
        count,
      });
    } catch (err) {
      console.log(err);
      const error = new VError("Failed to add a subtask.");
      error.originalError = err;
      throw error;
    }
  },
  updateTask: async (req, res) => {
    try {
      const { id, title, pageNum, page, queryString } = req.body;
      const task = await db.Task.findByPk(id);
      await task.update({
        title,
      });
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
      console.log(err);
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
      if (!is_completed) {
        await query.updateAncestors(task);
      }
      const whereClause = await query.current(page, queryString);
      let tasks = await query.pagination(pageNum, whereClause);
      if (!tasks.length && pageNum > 1) {
        pageNum = pageNum - 1;
        tasks = await query.pagination(pageNum, whereClause);
      }
      const totalCounts = await query.counts();
      const count = await db.Task.count(whereClause);
      res.json({
        tasks,
        totalCounts,
        count,
      });
    } catch (err) {
      console.log(err);
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
      console.log(err);
      const error = new VError("Failed to save the due date.");
      error.originalError = err;
      throw error;
    }
  },
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { page, queryString } = req.body;
      let { pageNum } = req.body;
      const task = await db.Task.findByPk(id);
      await task.destroy();
      const whereClause = await query.current(page, queryString);
      let tasks = await query.pagination(pageNum, whereClause);
      if (!tasks.length && pageNum > 1) {
        pageNum = pageNum - 1;
        tasks = await query.pagination(pageNum, whereClause);
      }
      const totalCounts = await query.counts();
      const count = await db.Task.count(whereClause);
      res.json({
        pageNum,
        tasks,
        totalCounts,
        count,
      });
    } catch (err) {
      console.log(err);
      const error = new VError("Failed to delete the task.");
      error.originalError = err;
      throw error;
    }
  },
  importFromExcel: async (req, res) => {
    try {
      const pathToFile = req.files.file.path;
      const schema = {
        "Title": {
          prop: "title",
          type: String,
          required: true,
        },
        "Complete": {
          prop: "is_completed",
          type: Boolean,
        },
        "Subtask": {
          prop: "subtask",
          type: String,
        },
        "Due Date": {
          prop: "due_date",
          type: String,
        },
        "Created Date": {
          prop: "created_date",
          type: String,
        },
        "Updated Date": {
          prop: "updated_date",
          type: String,
        },
      }
      const { rows } = await readXlsxFile(pathToFile, { schema });
      const data = rows.map((row) => {
        const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        row.due_date = !dateRegex.test(row.due_date) ? null : row.due_date;
        row.title = !row.title ? "No title..." : row.title;
        row.created_at = row.created_date;
        row.updated_at = row.updated_date;
        if (row.subtask) row.subtask = row.subtask.split("@").slice(1);
        return row;
      });
      await db.Task.bulkCreate(data);
      for (const task of data) {
        const parent = await query.all({
          where: {
            title: task.title,
          }
        });
        const parent_id = parent[0].id;
        if (task.subtask && !!task.subtask.length) {
          for (const title of task.subtask) {
            const subtask = await query.all({
              where: {
                title,
              }
            });
            await subtask[0].update({
              parent_id,
            });
          }
        }
      }
      const tasks = await query.pagination(1);
      const totalCounts = await query.counts();
      const count = await db.Task.count();
      res.json({
        tasks,
        totalCounts,
        count,
      });
    } catch (err) {
      console.log(err);
      const error = new VError("Failed to import data from excel file.");
      error.originalError = err;
      throw error;
    }
  },
};