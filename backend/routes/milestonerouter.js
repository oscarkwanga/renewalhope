const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { streamUpload } = require("../cloudinaryUpload");
const Milestones = require("../models/milestone")
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
     year,
     description,
      id,
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
      const existing = await Milestones.findOne({ id });

      if (existing) {
        return res.status(409).json({
          message: "Milestone already exists.",
        });
      }
    }

    const milestone = new Milestones({
      title,
      year,
      description,
      image,
      id,
    });
     

    await milestone.save();

    const io = getSocket();
    io.emit("getmilestone", milestone);

    res.status(201).json({
      message: "Milestone created successfully.",
      milestone,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not create milestone.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ALL MILESTONE
========================================================== */
router.get("/", async (req, res) => {
  try {
    const milestone = await Milestones.find().sort({ createdAt: -1 });

    res.status(200).json(milestone);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch milestones.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ONE MILESTONE
========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const milestone = await Milestones.findById({_id:req.params.id});

    if (!milestone) {
      return res.status(404).json({
        message: "Milestone not found.",
      });
    }

    res.status(200).json(milestone);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch milestone.",
      error: err.message,
    });
  }
});

/* ==========================================================
   UPDATE MILESTONE
========================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const milestoneId = req.params.id;

    const {
      title,
    year,
    description,
    } = req.body;

    const milestone = await Milestones.findById(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        message: "Milestone not found.",
      });
    }

    if (title !== undefined) milestone.title = title;
    if (year !== undefined) milestone.year = year;
    if (description !== undefined) milestone.description = description;
  
   if (req.file) {

    const publicId = `sermons/${Date.now()}`;

    const result = await streamUpload(
        req.file.path,
        "church_sermons",
        publicId
    );

    milestone.image = result.secure_url;

    fs.unlinkSync(req.file.path);
}

    await milestone.save();

    const io = getSocket();
    io.emit("updatemilestone", milestone);

    res.status(200).json({
      message: "Milestone updated successfully.",
      milestone,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not update milestone.",
      error: err.message,
    });
  }
});

/* ==========================================================
   DELETE MILESTONE
========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const milestone = await Milestones.findByIdAndDelete({_id:req.params.id});

    if (!milestone) {
      return res.status(404).json({
        message: "Milestone not found.",
      });
    }

    const io = getSocket();
    io.emit("deletemilestone", {
      id: req.params.id,
    });

    res.status(200).json({
      message: "Milestone deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not delete milestone.",
      error: err.message,
    });
  }
});

module.exports = router;