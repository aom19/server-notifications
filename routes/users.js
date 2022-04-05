const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    user
      .save()
      .then(() => res.json("User created "))
      .catch((err) => res.status(400).json(`Error : ${err}`));
  } catch (err) {
    console.log(err);
    throw err;
  }
});

router.post("/login", (req, res) => {
  console.log(req.body);

  User.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length < 1) {
        return res.sendStatus(404);
      }
      bcrypt.compare(req.body.password, users[0].password, (err, isEqual) => {
        if (err) return res.sendStatus(401);
        if (isEqual) {
          const token = jwt.sign(
            { userId: users[0]._id, email: users[0].email },
            //key to hash the token
            "somesupersecretkey",
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            message: "Login Success",
            token: token,
          });
        }
        res.sendStatus(401);
      });
    });

  //   let user = {};
  //   User.find()
  //     .then((users) => {
  //       user = users.filter((user) => user.email == req.body.email);
  //       console.log(user);
  //     })
  //     .catch((err) => res.status(400).json(`Error : ${err}`));
  //   res.json(user);
  //   if (user == null) {
  //     return res.status(400).send("User does not exist");
  //   }
  //   const isEqual = bcrypt.compare(req.body.password, user.password);
  //   console.log(isEqual);
  //   if (isEqual) {
  //     const token = jwt.sign(
  //       { userId: user.id, email: user.email },
  //       //key to hash the token
  //       "somesupersecretkey",
  //       { expiresIn: "1h" }
  //     );

  //     res.json(token);
  //   } else {
  //     res.status(400).send("Password does not match");
  //   }

  //

  //   const isEqual = await bcrypt.compare(req.body.password, user.password);
  //   console.log(isEqual);
  //   if (isEqual) {
  //     const token = jwt.sign(
  //       { userId: user.id, email: user.email },
  //       //key to hash the token
  //       "somesupersecretkey",
  //       { expiresIn: "1h" }
  //     );

  //     res.json(token);
  //   } else {
  //     res.status(400).send("Password does not match");
  //   }
});

module.exports = router;
