const express = require("express");

const router = express.Router();

const {

 getRiskDistribution,
 getTransactionTrends,
 getTrustDistribution,
 getFraudTrend,
 getTopRiskUsers

} = require(
 "../controllers/analyticsController"
);

router.get(
 "/risk-distribution",
 getRiskDistribution
);

router.get(
 "/transaction-trends",
 getTransactionTrends
);

router.get(
 "/trust-distribution",
 getTrustDistribution
);

router.get(
 "/fraud-trend",
 getFraudTrend
);

router.get(
 "/top-risk-users",
 getTopRiskUsers
);

module.exports = router;