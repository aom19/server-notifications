const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const webpush = require("web-push");

const User = require("../models/user");

const router = express.Router();

const vapidKeys = {
  publicKey:
    "BHcJ6sw5Ay67VobEVIhlEVrfvHqDFMnyzOLG9Vz8d1CRCYBdyCzt9aoVYdZq1feEwll9gG67g15uYMe-ghN7cVU",
  privateKey: "2rzVVOrVnPfBnc9PR6hDRBFV8jqTGh0kYPAQAe4-Iaw",
};

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

router.post("/add", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,

      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      pushSubscription: JSON.stringify(req.body.j),
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

router.get("/list", (req, res) => {
  User.find()
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => console.log(err));
});
router.post("/notificate/:id", (req, res) => {
  console.log("Notificate ");
  User.findById(req.body.id).then((user) => {
    let endpoint = JSON.parse(user.pushSubscription);

    webpush.sendNotification(endpoint, "Your Push Payload Text");
  });
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
