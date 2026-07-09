// backend/src/routes/depositRoutes.js
const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/depositController");

// Assuming you have an authentication middleware to verify the JWT token
const authMiddleware = require("../middleware/authMiddleware"); 

// POST /api/deposit/create-order
router.post("/create-order", authMiddleware, createOrder);

// POST /api/deposit/verify
router.post("/verify", authMiddleware, verifyPayment);

module.exports = router;