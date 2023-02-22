const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
app.use(cors({ origin: ["http://localhost:3000"], methods: "GET,POST,PUT,DELETE,OPTIONS", }));
app.use(express.json());
app.use(require("./routes/sample"));

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/app", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    app.listen(1337, () => {
      console.log("Node Server running on port 8000");
    });
    console.log("Database connected!");
  })
  .catch((err) => console.log(err));