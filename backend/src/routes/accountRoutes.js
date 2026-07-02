const express = require("express");

const router = express.Router();

const verifyToken =
    require("../middleware/authMiddleware");

const {
    createAccount
} = require("../controllers/accountController");

router.post(
    "/create",
    verifyToken,
    createAccount
);

module.exports = router;