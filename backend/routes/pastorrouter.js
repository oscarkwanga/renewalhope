const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { streamUpload } = require("../cloudinaryUpload");
const Pastors = require("../models/pastor")
const { getSocket } = require("../socket");

// ======================
// Multer Configuration
// ======================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ==========================================================
   CREATE NEW SERMON
========================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
     name,
     role,
     message,
      id
    } = req.body;

   let image = null;

if (req.file) {
    const publicId = `sermons/${Date.now()}`;

    const result = await streamUpload(
        req.file.path,
        "church_sermon",
        publicId
    );

    image = result.secure_url;

    fs.unlinkSync(req.file.path);
}

    // Prevent duplicate custom id (if supplied)
    if (id) {
      const existing = await Pastors.findOne({ id });

      if (existing) {
        return res.status(409).json({
          message: "Pastor already exists.",
        });
      }
    }

    const pastor = new Pastors({
  name,
  role,
  message,
  image,
      id
    });
     

    await pastor.save();

    const io = getSocket();
    io.emit("getpastor", pastor);

    res.status(201).json({
      message: "Pastor created successfully.",
      pastor,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not create pastor.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ALL PASTOR
========================================================== */
router.get("/", async (req, res) => {
  try {
    const pastor = await Pastors.find().sort({ createdAt: -1 });

    res.status(200).json(pastor);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch pastor.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ONE PASTOR
========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const pastor = await Pastors.findById({_id:req.params.id});

    if (!pastor) {
      return res.status(404).json({
        message: "Pastor not found.",
      });
    }

    res.status(200).json(pastor);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch pastor.",
      error: err.message,
    });
  }
});

/* ==========================================================
   UPDATE PASTOR
========================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const pastorId = req.params.id;

    const {
    name,
    role,
    message
    } = req.body;

    const pastor = await Pastors.findById(pastorId);

    if (!pastor) {
      return res.status(404).json({
        message: "Pastor not found.",
      });
    }

    if (name !== undefined) pastor.name = name;
    if (role !== undefined) pastor.role = role;
    if (message !== undefined) pastor.message = message;
  
   if (req.file) {

    const publicId = `sermons/${Date.now()}`;

    const result = await streamUpload(
        req.file.path,
        "church_sermons",
        publicId
    );

    pastor.image = result.secure_url;

    fs.unlinkSync(req.file.path);
}

    await pastor.save();

    const io = getSocket();
    io.emit("updatepastor", pastor);

    res.status(200).json({
      message: "Pastor updated successfully.",
      pastor,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not update pastor.",
      error: err.message,
    });
  }
});

/* ==========================================================
   DELETE PASTOR
========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const pastor = await Pastors.findByIdAndDelete({_id:req.params.id});

    if (!pastor) {
      return res.status(404).json({
        message: "Pastor not found.",
      });
    }

    const io = getSocket();
    io.emit("deletepastor", {
      id: req.params.id,
    });

    res.status(200).json({
      message: "Pastor deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not delete pastor.",
      error: err.message,
    });
  }
});

module.exports = router;