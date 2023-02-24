const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 8000;
// if we want to test with postman x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// when deployment uncomment this
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: "GET,POST,PUT,DELETE,OPTIONS",
//   })
// );

app.use(express.json());
app.use(require("./routes/sample"));
app.use(require("./routes/project"));
app.use(require("./routes/user"));

app.get("/", (req, res) => {
  res.send("Server is running on Port " + PORT);
});

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/app", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Node Server running on port "+PORT);
    });
    console.log("Database connected!");
  })
  .catch((err) => console.log(err));
