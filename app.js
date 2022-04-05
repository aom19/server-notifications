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

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

//routes

const partnersRoutes = require("./routes/partners");
const userRoutes = require("./routes/users");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/partners", partnersRoutes);
app.use("/users", userRoutes);

mongoose
  .connect(
    `mongodb+srv://Anton:No4XkJVQILLqJzCc@cluster0.ku5rn.mongodb.net/Notifications-React?retryWrites=true&w=majority`
  )

  .then(() => {
    console.log("Server start at port " + PORT);
    console.log("MongoDB is connected");
    app.listen(process.env.PORT || PORT);
  })
  .catch((err) => {
    console.log(err);
  });
