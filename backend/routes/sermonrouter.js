const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { streamUpload } = require("../cloudinaryUpload");
const cloudinary = require("cloudinary").v2;
const Sermons = require("../models/sermon");
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
      slug,
      speaker,
      date,
      readingTime,
      introduction,
      sections,
      scripture,
      keyVerse,
      quote,
      
      prayer,
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
      const existing = await Sermons.findOne({ id });

      if (existing) {
        return res.status(409).json({
          message: "Sermon already exists.",
        });
      }
    }


    let parsedSections = [];

if (sections) {
    try {
        parsedSections = JSON.parse(sections);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid sections format."
        });
    }
}

    const sermon = new Sermons({
      title,
      slug,
      speaker,
      date,
      readingTime,
      introduction,
      sections: parsedSections,
      scripture,
      keyVerse,
      quote,
     
      prayer,
      image,
      id,
    });

    await sermon.save();

    const io = getSocket();
    io.emit("getsermon", sermon);

    res.status(201).json({
      message: "Sermon created successfully.",
      sermon,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not create sermon.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ALL SERMONS
========================================================== */
router.get("/", async (req, res) => {
  try {
    const sermons = await Sermons.find().sort({ createdAt: -1 });

    res.status(200).json(sermons);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch sermons.",
      error: err.message,
    });
  }
});

/* ==========================================================
   GET ONE SERMON
========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const sermon = await Sermons.findById({_id:req.params.id});

    if (!sermon) {
      return res.status(404).json({
        message: "Sermon not found.",
      });
    }

    res.status(200).json(sermon);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not fetch sermon.",
      error: err.message,
    });
  }
});

/* ==========================================================
   UPDATE SERMON
========================================================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const sermonId = req.params.id;

    const {
      title,
      slug,
      speaker,
      date,
      readingTime,
      introduction,
      sections,
      scripture,
      keyVerse,
      quote,
   
      prayer,
    } = req.body;

    const sermon = await Sermons.findById(sermonId);

    if (!sermon) {
      return res.status(404).json({
        message: "Sermon not found.",
      });
    }

    if (title !== undefined) sermon.title = title;
    if (slug !== undefined) sermon.slug = slug;
    if (speaker !== undefined) sermon.speaker = speaker;
    if (date !== undefined) sermon.date = date;
    if (readingTime !== undefined) sermon.readingTime = readingTime;
    if (introduction !== undefined) sermon.introduction = introduction;
   if (sections !== undefined) {
    try {
        sermon.sections = JSON.parse(sections);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid sections format."
        });
    }
}
    if (scripture !== undefined) sermon.scripture = scripture;
    if (keyVerse !== undefined) sermon.keyVerse = keyVerse;
    if (quote !== undefined) sermon.quote = quote;
 
    if (prayer !== undefined) sermon.prayer = prayer;

    if (req.file) {

    const publicId = `sermons/${Date.now()}`;

    const result = await streamUpload(
        req.file.path,
        "church_sermons",
        publicId
    );

    sermon.image = result.secure_url;

    fs.unlinkSync(req.file.path);
}

    await sermon.save();

    const io = getSocket();
    io.emit("updatesermon", sermon);

    res.status(200).json({
      message: "Sermon updated successfully.",
      sermon,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not update sermon.",
      error: err.message,
    });
  }
});

/* ==========================================================
   DELETE SERMON
========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const sermon = await Sermons.findByIdAndDelete({_id:req.params.id});

    if (!sermon) {
      return res.status(404).json({
        message: "Sermon not found.",
      });
    }

    const io = getSocket();
    io.emit("deleteposter", {
      id: req.params.id,
    });

    res.status(200).json({
      message: "Sermon deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Could not delete sermon.",
      error: err.message,
    });
  }
});

module.exports = router;