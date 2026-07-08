const express =require("express");
const router =express.Router();
const verifyToken =require("../middleware/authMiddleware");
const requireAnalyst = require("../middleware/analystMiddleware");

const { getDashboardData}=require( "../controllers/dashboardController");

router.get(
 "/",
 verifyToken,
 requireAnalyst,
 getDashboardData
);

module.exports =router;