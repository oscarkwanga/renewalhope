const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { streamUpload } = require("../cloudinaryUpload");
const Stories = require("../models/story");
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
   CREATE NEW STORY
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
      const existing = await Stories.findOne({ id });

      if (existing) {
        return res.status(409).json({
          message: "Story already exists.",
        });
      }
    }

    const story = new Stories({
      title,
      text,
      image,
      id,
    });
     

    await story.save();

    const io = getSocket();
    io.emit("getstory", story);

    res.status(201).json({
      message: "Story created successfully.",
      story,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not create story.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ALL STORIES
========================================================== */
router.get("/", async (req, res) => {
  try {
    const stories = await Stories.find().sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch stories.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ONE STORIES
========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const story = await Stories.findById({_id:req.params.id});

    if (!story) {
      return res.status(404).json({
        message: "Story not found.",
      });
    }

    res.status(200).json(story);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch story.",
      error: err.message,
    });
  }
});

/* ==========================================================
   UPDATE STORY
========================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const storyId = req.params.id;

    const {
      title,
   text,
   image
    } = req.body;

    const story = await Stories.findById(storyId);

    if (!story) {
      return res.status(404).json({
        message: "Story not found.",
      });
    }

    if (title !== undefined) story.title = title;
    if (text !== undefined) story.text = text;
  

 if (req.file) {

    const publicId = `sermons/${Date.now()}`;

    const result = await streamUpload(
        req.file.path,
        "church_sermons",
        publicId
    );

    story.image = result.secure_url;

    fs.unlinkSync(req.file.path);
}

    await story.save();

    const io = getSocket();
    io.emit("updatestory", story);

    res.status(200).json({
      message: "Story updated successfully.",
      story,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not update story.",
      error: err.message,
    });
  }
});

/* ==========================================================
   DELETE STORY
========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const story = await Stories.findByIdAndDelete({_id : req.params.id});

    if (!story) {
      return res.status(404).json({
        message: "Story not found.",
      });
    }

    const io = getSocket();
    io.emit("deletestory", {
      id: req.params.id,
    });

    res.status(200).json({
      message: "Story deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not delete story.",
      error: err.message,
    });
  }
});

module.exports = router;