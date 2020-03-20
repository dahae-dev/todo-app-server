module.exports = {
  getAllTasks: async (req, res, next) => {
    try {
      res.json({
        tasks: ["todo 1", "todo 2", "todo 3"],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
