const express = require("express");
const router = express.Router();
const formidableMiddleware = require('express-formidable');

const taskController = require("../controllers/tasks");

router.get("/search/:queryString/:pageNum", taskController.getSearchTasks);
router.get("/filter/:queryString/:pageNum", taskController.getFilteredTasks);
router.get("/:pageNum", taskController.getTasksPerPage);
router.get("/", taskController.getAllTasks);
router.post("/import", formidableMiddleware(), taskController.importFromExcel);
router.post("/sub", taskController.addSubtask);
router.post("/", taskController.addNewTask);
router.patch("/complete", taskController.updateComplete);
router.patch("/duedate", taskController.updateDuedate);
router.patch("/", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
