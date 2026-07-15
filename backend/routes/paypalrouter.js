const express = require("express");

const router = express.Router();

const {
    createOrder,
    captureOrder,
} = require("../paypalController");

router.post("/create-order", createOrder);

router.post("/capture-order/:orderID", captureOrder);

module.exports = router;