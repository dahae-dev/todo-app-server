module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return Task;
};
