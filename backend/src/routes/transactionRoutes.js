const express = require("express");

const router = express.Router();

const verifyToken =
require("../middleware/authMiddleware");

const {
    transferMoney,
    getTransactionHistory,
    getAllTransactions,
    getRecentRecipients
} =
require("../controllers/transactionController");

router.post(
    "/transfer",
    verifyToken,
    transferMoney
);
router.get(
 "/history",
 verifyToken,
 getTransactionHistory
);
router.get(
 "/",
 verifyToken,
 getAllTransactions
);
router.get(
 "/recent-recipients",
 verifyToken,
 getRecentRecipients
);

module.exports = router;