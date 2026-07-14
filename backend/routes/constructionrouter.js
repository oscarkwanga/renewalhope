const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { streamUpload } = require("../cloudinaryUpload");
const Constructions = require("../models/construction");
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
   CREATE NEW CONSTRUCTION
========================================================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
     title,
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
      const existing = await Constructions.findOne({ id });

      if (existing) {
        return res.status(409).json({
          message: "Construction already exists.",
        });
      }
    }

    const construction = new Constructions({
      title,
      image,
      id,
    });
     

    await construction.save();

    const io = getSocket();
    io.emit("getconstruction", construction);

    res.status(201).json({
      message: "Construction created successfully.",
      construction,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not create construction.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ALL CONSTRUCTIONS
========================================================== */
router.get("/", async (req, res) => {
  try {
    const construction = await Constructions.find().sort({ createdAt: -1 });

    res.status(200).json(construction);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch construction.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ONE CONSTRUCTION
========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const construction = await Constructions.findById({_id:req.params.id});

    if (!construction) {
      return res.status(404).json({
        message: "Construction not found.",
      });
    }

    res.status(200).json(construction);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch construction.",
      error: err.message,
    });
  }
});

/* ==========================================================
   UPDATE CONSTRUCTION
========================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const constructionId = req.params.id;

    const {
      title,
   image
    } = req.body;

    const construction = await Constructions.findById(constructionId);

    if (!construction) {
      return res.status(404).json({
        message: "Construction not found.",
      });
    }

    if (title !== undefined) construction.title = title;

 if (req.file) {

    const publicId = `sermons/${Date.now()}`;

    const result = await streamUpload(
        req.file.path,
        "church_sermons",
        publicId
    );

    construction.image = result.secure_url;

    fs.unlinkSync(req.file.path);
}

    await construction.save();

    const io = getSocket();
    io.emit("updateconstruction", construction);

    res.status(200).json({
      message: "Construction updated successfully.",
      construction,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not update construction.",
      error: err.message,
    });
  }
});

/* ==========================================================
   DELETE CONSTRUCTION
========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const construction = await Constructions.findByIdAndDelete({_id : req.params.id});

    if (!construction) {
      return res.status(404).json({
        message: "Construction not found.",
      });
    }

    const io = getSocket();
    io.emit("deleteconstruction", {
      id: req.params.id,
    });

    res.status(200).json({
      message: "Construction deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not delete construction.",
      error: err.message,
    });
  }
});

module.exports = router;