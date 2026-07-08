const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const requireAnalyst = require("../middleware/analystMiddleware");
const {  getRiskyUsers} = require("../controllers/riskController");

router.get(
  "/risky-users",
  verifyToken,
  requireAnalyst,
  getRiskyUsers
);

module.exports = router;