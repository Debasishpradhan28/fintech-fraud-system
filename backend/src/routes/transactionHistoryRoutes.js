const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const requireAnalyst = require("../middleware/analystMiddleware");
const { getTransactions}=require( "../controllers/transactionHistoryController");

router.get(
     "/history",
     verifyToken,
     requireAnalyst,
     getTransactions
    );

module.exports = router;