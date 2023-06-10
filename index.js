const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 8000;
const sendMail = require("./mail/mailer");

const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

require("dotenv").config();

// if we want to test with postman x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const Notification = require('./models/notification.model');
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
app.use(require("./routes/adminNotification"));
app.use(require("./routes/userNotification"));

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
  .connect("mongodb://localhost:27017/app", {
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

// Import the notification router
const userNotificationRouter = require("./routes/userNotification");
const adminNotificationRouter = require("./routes/adminNotification");
const router = require("./routes/adminNotification");
const adminRouter = require("./routes/adminNotification");


// Use the user and admin notification routers
app.use("/api/user", userNotificationRouter);
app.use("/api/admin", adminNotificationRouter);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("A client connected.");

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected.");
  });
});

app.post('/notifications', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Save the notification to the database
    const notification = await Notification.create({ message });

    // Emit the notification to all connected clients
    io.emit('notification', notification);

    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});