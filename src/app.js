const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");
const app = express();

app.use(express.json()); // automatic convert json into object

const port = process.env.PORT || 3000;

app.use(userRouter);
app.use(taskRouter);

const multer = require("multer");

const upload = multer({
  dest: "images",
});

app.post("/upload", upload.single("upload"), (req, res) => {
  res.send();
});



app.listen(port, () => {
  console.log("Server started on " + port);
});
