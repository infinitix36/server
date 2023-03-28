const express = require("express");
const toDoRoute = express.Router();
const ToDo = require("../models/todo.model");

toDoRoute.route("/todo/addtask").post(function (req, res) {
  const userID = req.body.userID;
  const task = req.body.taskName;
  const dueDate = req.body.dueDate;
  const newTask = {
    taskid: Date.now(),
    taskName: task,
    taskStatus: false,
    createdDate: Date.now(),
    dueDate: dueDate,
  };

  ToDo.findOneAndUpdate(
    { userID: userID },
    { $push: { tasks: newTask } },
    { upsert: true, new: true },
    (err, user) => {
      if (err) {
        return res.json({
          message: "Error try again !",
          status: false,
        });
      } else {
        return res.json({
          message: "Task Added Successfully",
          status: true,
        });
      }
    }
  );
});

toDoRoute.route("/todo/showusertodo/:id").get(function (req, res) {
  const userID = req.params.id;
  ToDo.find({ userID: userID }, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
});

toDoRoute.route("/todo/markasdone").post(function (req, res) {
  const todoID = req.body.todoid;
  const taskID = req.body.taskid;
  ToDo.findById(todoID, function (err, todo) {
    todo.tasks.find((tasks) => tasks.taskid === taskID).taskStatus = true;
    ToDo.updateOne(
      { _id: todoID },
      {
        $set: {
          tasks: todo.tasks,
        },
      }
    )
      .then((result) => {
        return res.json({
          message: "Task Marked as Done",
          status: true,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          message: "Error",
          status: false,
        });
      });
  });

  console.log(taskID);
});

toDoRoute.route("/todo/deletetask").post(function (req, res) {
  const todoID = req.body.todoid;
  const taskID = req.body.taskid;
  console.log(taskID);
  console.log(todoID);
  ToDo.findById(todoID, function (err, todo) {

    //creates a new array with all elements which's task id doesn't match with the id requested
    todo.tasks = todo.tasks.filter((task) => task.taskid !== taskID);

    //update the tasks field of the ToDo document with the specified ID, replacing the old array of tasks with a new array that doesn't include the task to be deleted.
    ToDo.updateOne(
      { _id: todoID }, //query object that specifies which document to update
      //update object that specifies how to modify the document


      {
        $set: {
          tasks: todo.tasks,
        },
      }
    )
      .then((result) => {
        return res.json({
          message: "Task Deleted",
          status: true,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          message: "Error",
          status: false,
        });
      });
  });
});


// toDoRoute.route("/todo/deletetask/:todoid/:taskid").delete(function (req, res) {
//   const todoID = req.params.todoid;
//   const taskID = req.params.taskid;
//   console.log(taskID);
//   console.log(todoID);
//   ToDo.findById(todoID, function (err, todo) {
//     todo.tasks = todo.tasks.filter((task) => task.taskid !== taskID);
//     console.log(todo.tasks)
//     ToDo.updateOne(
//       { _id: todoID },
//       {
//         $set: {
//           tasks: todo.tasks,
//         },
//       }
//     )
//       .then((result) => {
//         // console.log(result);
//         return res.json({
//           message: "Task Deleted",
//           status: true,
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         return res.json({
//           message: "Error",
//           status: false,
//         });
//       });
//   });
// });


module.exports = toDoRoute;
