const express = require("express");

const router = express.Router();

const {
 getTransactions
}
=
require(
 "../controllers/transactionHistoryController"
);

router.get(
 "/history",
 getTransactions
);

module.exports = router;