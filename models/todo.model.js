const mongoose = require("mongoose");
const ToDo = new mongoose.Schema(
  {
    userID: { type: String, required: true },

    tasks: [{ type: Object }],
  }
  // {
  //   collection: "ToDo",
  // }

);
const model = mongoose.model("ToDoData", ToDo);
module.exports = model;
