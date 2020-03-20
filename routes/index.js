const express = require("express");
const router = express.Router();

const taskController = require("../controllers/tasks");

router.get("/", taskController.getAllTasks);
router.post("/", taskController.addNewTask);
router.patch("/", taskController.updateTask);

module.exports = router;
