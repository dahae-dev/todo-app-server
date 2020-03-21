const express = require("express");
const router = express.Router();

const taskController = require("../controllers/tasks");

router.get("/", taskController.getAllTasks);
router.post("/", taskController.addNewTask);
router.patch("/complete", taskController.updateComplete);
router.patch("/duedate", taskController.updateDuedate);
router.patch("/", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
