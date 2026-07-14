const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { streamUpload } = require("../cloudinaryUpload");
const Cultures = require("../models/culture");
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
   CREATE NEW CULTURE
========================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
     title,
    text,
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
      const existing = await Cultures.findOne({ id });

      if (existing) {
        return res.status(409).json({
          message: "Culture already exists.",
        });
      }
    }

    const culture = new Cultures({
      title,
      text,
      image,
      id,
    });
     

    await culture.save();

    const io = getSocket();
    io.emit("getculture", culture);

    res.status(201).json({
      message: "Culture created successfully.",
      culture,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not create culture.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ALL CULTURES
========================================================== */
router.get("/", async (req, res) => {
  try {
    const cultures = await Cultures.find().sort({ createdAt: -1 });

    res.status(200).json(cultures);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch cultures.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ONE CULTURE
========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const culture = await Cultures.findById({_id:req.params.id});

    if (!culture) {
      return res.status(404).json({
        message: "Culture not found.",
      });
    }

    res.status(200).json(culture);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch culture.",
      error: err.message,
    });
  }
});

/* ==========================================================
   UPDATE CULTURE
========================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const cultureId = req.params.id;

    const {
      title,
   text,
   image
    } = req.body;

    const culture = await Cultures.findById(cultureId);

    if (!culture) {
      return res.status(404).json({
        message: "Culture not found.",
      });
    }

    if (title !== undefined) culture.title = title;
    if (text !== undefined) culture.text = text;
   
 if (req.file) {

    const publicId = `sermons/${Date.now()}`;

    const result = await streamUpload(
        req.file.path,
        "church_sermons",
        publicId
    );

    culture.image = result.secure_url;

    fs.unlinkSync(req.file.path);
}

    await culture.save();

    const io = getSocket();
    io.emit("updateculture", culture);

    res.status(200).json({
      message: "Culture updated successfully.",
      culture,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not update culture.",
      error: err.message,
    });
  }
});

/* ==========================================================
   DELETE CULTURE
========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const culture = await Cultures.findByIdAndDelete({_id : req.params.id});

    if (!culture) {
      return res.status(404).json({
        message: "Culture not found.",
      });
    }

    const io = getSocket();
    io.emit("deleteculture", {
      id: req.params.id,
    });

    res.status(200).json({
      message: "Culture deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not delete culture.",
      error: err.message,
    });
  }
});

module.exports = router;