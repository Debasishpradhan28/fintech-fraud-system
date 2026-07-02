const express = require("express");

const router = express.Router();

const {
  getRiskyUsers
} = require("../controllers/riskController");

router.get(
  "/risky-users",
  getRiskyUsers
);

module.exports = router;