const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 8000;
const sendMail = require("./mail/mailer");
require("dotenv").config();

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
app.use(require("./routes/todo"));
app.use(require("./routes/authentication"));
app.use(require("./routes/git"));
app.use(require("./routes/jira"));
// app.use(require("./routes/notification"));

app.get("/", (req, res) => {
  res.send("Server is running on Port " + PORT);
});

app.get("/sendmail", async (req, res) => {
  const mailOptions = {
    to: "matheshyogeswaran@gmail.com",
    subject: "Mathesh",
    html: "This is New Mail !",
  };
  const success = await sendMail(mailOptions);
  if (success) {
    return res.json({ status: true });
  } else {
    return res.json({ status: false });
  }
});

app.get("/sendmailTo/:email", async (req, res) => {
  const mailOptions = {
    to: req.params.email,
    subject: "Subject about verify",
    html: "This is Test Mail !",
  };
  const success = await sendMail(mailOptions);
  if (success) {
    return res.json({ status: true });
  } else {
    return res.json({ status: false });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Node Server running on port " + PORT);
    });
    console.log("Database connected!");
  })
  .catch((err) => console.log(err));
