const express = require("express");
const webpush = require("web-push");

const bcrypt = require("bcryptjs");

// VAPID keys should only be generated only once.
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

const router = express.Router();

const Device = require("../models/device");

router.post("/add", async (req, res) => {
  // console.log(JSON.parse(req.body));
  try {
    // const hashedPassword = await bcrypt.hash(req.body.password, 12);
    // console.log(hashedPassword);
    console.log(req.body);
    const device = new Device({
      email: req.body.values.email,
      password: req.body.values.password,
      firstName: req.body.values.firstName,
      lastName: req.body.values.lastName,
      phoneNumber: req.body.values.phoneNumber,
      address: req.body.values.address,
      pushSubscription: JSON.stringify(req.body.values.pushSubscription),
    });
    console.log(device);
    await device
      .save()
      .then(() => res.json("Device created "))
      .catch((err) => res.status(400).json(`Error : ${err}`));
  } catch (err) {
    console.log(err);
    throw err;
  }
});
//get all
router.get("/", (req, res) => {
  Device.find()
    .then((devices) => res.json(devices))
    .catch((err) => res.status(400).json(`Error : ${err}`));
});
router.post("/notificate/:id", (req, res) => {
  console.log("Notificate ");
  Device.findById(req.body.id).then((device) => {
    let endpoint = JSON.parse(device.pushSubscription);

    webpush.sendNotification(endpoint, "Your Push Payload Text");
  });
});

router.post("/add", (req, res) => {
  console.log("Device Route /device/post ");
  console.log(req.body);
});

router.post("/add/14", (req, res) => {
  const pushSubscription = {
    endpoint:
      "https://fcm.googleapis.com/fcm/send/cDMH-sAmG3w:APA91bHLYijxBrhie4dgVXPsp-Y5B_Xg-EE6On0mBddBioe4lONFQe_M0bCYvNvJWUWDfkfXGLH3z3SQSCF9ZPmKiIqVG9qff_ZsOsXhZMKlDX8f0sUfCdc8eNCSaPfXAu4ali_WMj6x",
    expirationTime: null,
    keys: {
      p256dh:
        "BB_RzJ3lvhtEMytE4Zm396ByWlI9pphO5QSPwGWUxsCDJE4dI1v59AowZ1XYyxM8H0CzBeG79Lhg3T0jrgw3ZM8",
      auth: "U7zL5HL9B8eiMVChk0GM5g",
    },
  };

  webpush.sendNotification(pushSubscription, "Your Push Payload Text");
});

//post new
// router.post("/add", upload.single("partnerImage"), (req, res) => {
//   console.log(req.body);
//   const newPartner = new Partners({
//     email: req.body.email,
//     name: req.body.name,
//     description: req.body.description,
//     partnerImage: `http://localhost:8000/uploads/${req.file.originalname}`,
//   });

//   newPartner
//     .save()
//     .then(() => res.json(newPartner))
//     .catch((err) => res.status(400).json(`Error : ${err}`));
// });

// //get by id
// router.get("/:id", (req, res) => {
//   Partners.findById(req.params.id)
//     .then((partner) => res.json(partner))
//     .catch((err) => res.status(400).json(`Error : ${err}`));
// });

// // update

// router.put("/update/:id", upload.single("partnerImage"), (req, res) => {
//   console.log(req.body);
//   Partners.findById(req.params.id)
//     .then((partner) => {
//       (partner.name = req.body.name),
//         (partner.email = req.body.email),
//         (partner.description = req.body.description),
//         (partner.partnerImage = `http://localhost:8000/uploads/${req.file.originalname}`),
//         partner
//           .save()
//           .then(() => res.json(partner))
//           .catch((err) => res.status(400).json(`Error : ${err}`));
//     })
//     .catch((err) => res.status(400).json(`Error : ${err}`));
// });

// //delete

// router.delete("/:id", (req, res) => {
//   Partners.findByIdAndDelete(req.params.id)
//     .then(() => res.json("The partner is deleted"))
//     .catch((err) => res.status(400).json(`error: ${err}`));
// });

module.exports = router;
