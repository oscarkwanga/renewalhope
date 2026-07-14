const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { streamUpload } = require("../cloudinaryUpload");
const Ministries = require("../models/ministry");
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
      title,
     subtitle,
     description,
      id,
    } = req.body;

   let image = null;

if (req.file) {
    const publicId = `sermons/${Date.now()}`;

    const result = await streamUpload(
        req.file.path,
        "church_sermons",
        publicId
    );

    image = result.secure_url;

    fs.unlinkSync(req.file.path);
}

    // Prevent duplicate custom id (if supplied)
    if (id) {
      const existing = await Ministries.findOne({ id });

      if (existing) {
        return res.status(409).json({
          message: "Ministry already exists.",
        });
      }
    }

    const ministry = new Ministries({
      title,
      subtitle,
      description,
      image,
      id,
    });
     

    await ministry.save();

    const io = getSocket();
    io.emit("getministry", ministry);

    res.status(201).json({
      message: "Ministry created successfully.",
      ministry,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not create ministry.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ALL MINISTRIES
========================================================== */
router.get("/", async (req, res) => {
  try {
    const ministries = await Ministries.find().sort({ createdAt: -1 });

    res.status(200).json(ministries);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch ministries.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ONE MINISTRY
========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const ministry = await Ministries.findById({_id:req.params.id});

    if (!ministry) {
      return res.status(404).json({
        message: "Ministry not found.",
      });
    }

    res.status(200).json(ministry);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch ministry.",
      error: err.message,
    });
  }
});

/* ==========================================================
   UPDATE MINISTRY
========================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const ministryId = req.params.id;

    const {
      title,
     subtitle,
     description,
    } = req.body;

    const ministry = await Ministries.findById(ministryId);

    if (!ministry) {
      return res.status(404).json({
        message: "Ministry not found.",
      });
    }

    if (title !== undefined) ministry.title = title;
    if (subtitle !== undefined) ministry.subtitle = subtitle;
    if (description !== undefined) ministry.description = description;
  
   if (req.file) {

    const publicId = `sermons/${Date.now()}`;

    const result = await streamUpload(
        req.file.path,
        "church_sermons",
        publicId
    );

    ministry.image = result.secure_url;

    fs.unlinkSync(req.file.path);
}

    await ministry.save();

    const io = getSocket();
    io.emit("updateministry", ministry);

    res.status(200).json({
      message: "Ministry updated successfully.",
      ministry,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not update ministry.",
      error: err.message,
    });
  }
});

/* ==========================================================
   DELETE MINISTRY
========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const ministry = await Ministries.findByIdAndDelete({_id:req.params.id});

    if (!ministry) {
      return res.status(404).json({
        message: "Ministry not found.",
      });
    }

    const io = getSocket();
    io.emit("deleteministry", {
      id: req.params.id,
    });

    res.status(200).json({
      message: "Ministry deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not delete ministry.",
      error: err.message,
    });
  }
});

module.exports = router;