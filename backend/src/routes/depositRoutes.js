// backend/src/routes/depositRoutes.js
const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/depositController");
const authMiddleware = require("../middleware/authMiddleware"); 

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);

module.exports = router;