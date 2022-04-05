const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = 8000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
require("dotenv").config();

//routes

// const partnersRoutes = require("./routes/partners");
// const userRoutes = require("./routes/users");
const devicesRoutes = require("./routes/devices");

// app.use("/partners", partnersRoutes);
// app.use("/users", userRoutes);
app.use("/devices", devicesRoutes);

mongoose
  .connect(
    // `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ku5rn.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`
    `mongodb+srv://Anton:No4XkJVQILLqJzCc@cluster0.ku5rn.mongodb.net/Notifications-React?retryWrites=true&w=majority`
  )

  .then(() => {
    console.log("Server start at port " + PORT);
    console.log("MongoDB is connected");
    // app.listen(PORT);
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
