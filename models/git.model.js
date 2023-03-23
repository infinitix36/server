const mongoose = require("mongoose");
const Git = new mongoose.Schema(
  {
    pName: { type: String, required: true },
    commitDetails: [{ type: Object }],
    
  }
  
);
const model = mongoose.model("GitData", Git);
module.exports = model;
