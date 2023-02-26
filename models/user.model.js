const mongoose = require("mongoose");
const User = new mongoose.Schema(
  {
    useRoleName: { type: String },
    users: [{ type: Object }],
  },
  {
    collection: "userRoles",
  }
);
const model = mongoose.model("UserData", User);
module.exports = model;
