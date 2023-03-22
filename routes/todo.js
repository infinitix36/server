const express = require("express");
const toDoRoute = express.Router();
const ToDo = require("../models/todo.model");

toDoRoute.route("/todo/addtask").post(function (req, res) {
  const userID = req.body.userID;
  const task = req.body.taskName;
  const dueDate = req.body.dueDate;
  const newTask = {
    _id: Date.now(),
    taskName: task,
    taskStatus: false,
    createdDate: Date.now(),
    dueDate:dueDate,
  };

  ToDo.findOneAndUpdate(
    { userID: userID },
    { $push: { tasks: newTask } },
    { upsert: true, new: true },
    (err, user) => {
      if (err) {
        return res.json({ message: "Error try again !", status: false });
      } else {
        return res.json({ message: "Task Added Successfully", status: true });
      }
    }
  );
});

toDoRoute.route("/todo/showusertodo/:id").get(function (req, res) {
    const userID = req.params.id;
    ToDo.find({userID:userID}, (err, users) => {
        if (err) {
            res.send(err);
        } else {
            res.json(users);
        }
    });
});

module.exports = toDoRoute;
