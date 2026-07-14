const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { streamUpload } = require("../cloudinaryUpload");
const Events = require("../models/event");
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
     date,
     time,
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
      const existing = await Events.findOne({ id });

      if (existing) {
        return res.status(409).json({
          message: "Event already exists.",
        });
      }
    }

    const event = new Events({
      title,
      date,
      time,
      description,
      image,
      id,
    });
     

    await event.save();

    const io = getSocket();
    io.emit("getevent", event);

    res.status(201).json({
      message: "Event created successfully.",
      event,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not create event.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ALL EVENTS
========================================================== */
router.get("/", async (req, res) => {
  try {
    const events = await Events.find().sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch events.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ONE EVENT
========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const event = await Events.findById({_id:req.params.id});

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch event.",
      error: err.message,
    });
  }
});

/* ==========================================================
   UPDATE EVENT
========================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const eventId = req.params.id;

    const {
      title,
    date,
    time,
    description,
    } = req.body;

    const event = await Events.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    if (title !== undefined) event.title = title;
    if (date !== undefined) event.date = date;
    if (time !== undefined) event.time = time;
    if (description !== undefined) event.description = description;

   if (req.file) {

    const publicId = `sermons/${Date.now()}`;

    const result = await streamUpload(
        req.file.path,
        "church_sermons",
        publicId
    );

    event.image = result.secure_url;

    fs.unlinkSync(req.file.path);
}

    await event.save();

    const io = getSocket();
    io.emit("updateevent", event);

    res.status(200).json({
      message: "Event updated successfully.",
      event,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not update event.",
      error: err.message,
    });
  }
});

/* ==========================================================
   DELETE EVENT
========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const event = await Events.findByIdAndDelete({_id:req.params.id});

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    const io = getSocket();
    io.emit("deleteevent", {
      id: req.params.id,
    });

    res.status(200).json({
      message: "Event deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not delete event.",
      error: err.message,
    });
  }
});

module.exports = router;