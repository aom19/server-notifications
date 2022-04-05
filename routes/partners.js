const express = require("express");
const multer = require("multer");
const router = express.Router();

const Partners = require("../models/partner");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//get all
router.get("/", (req, res) => {
  Partners.find()
    .then((partners) => res.json(partners))
    .catch((err) => res.status(400).json(`Error : ${err}`));
});

//post new
router.post("/add", upload.single("partnerImage"), (req, res) => {
  console.log(req.body);
  const newPartner = new Partners({
    email: req.body.email,
    name: req.body.name,
    description: req.body.description,
    partnerImage: `http://localhost:8000/uploads/${req.file.originalname}`,
  });

  newPartner
    .save()
    .then(() => res.json(newPartner))
    .catch((err) => res.status(400).json(`Error : ${err}`));
});

//get by id
router.get("/:id", (req, res) => {
  Partners.findById(req.params.id)
    .then((partner) => res.json(partner))
    .catch((err) => res.status(400).json(`Error : ${err}`));
});

// update

router.put("/update/:id", upload.single("partnerImage"), (req, res) => {
  console.log(req.body);
  Partners.findById(req.params.id)
    .then((partner) => {
      (partner.name = req.body.name),
        (partner.email = req.body.email),
        (partner.description = req.body.description),
        (partner.partnerImage = `http://localhost:8000/uploads/${req.file.originalname}`),
        partner
          .save()
          .then(() => res.json(partner))
          .catch((err) => res.status(400).json(`Error : ${err}`));
    })
    .catch((err) => res.status(400).json(`Error : ${err}`));
});

//delete

router.delete("/:id", (req, res) => {
  Partners.findByIdAndDelete(req.params.id)
    .then(() => res.json("The partner is deleted"))
    .catch((err) => res.status(400).json(`error: ${err}`));
});

module.exports = router;
