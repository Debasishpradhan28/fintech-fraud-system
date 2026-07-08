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
const verifyToken = require("../middleware/authMiddleware");
const requireAnalyst = require("../middleware/analystMiddleware");
router.get(
    "/test",
    verifyToken,
    requireAnalyst,
    (req, res) => {

        res.json({
            success: true,
            role: req.user.role,
            message: "Access Granted"
        });

    }
);
router.get(
 "/risk-distribution",
 verifyToken,
 requireAnalyst,
 getRiskDistribution
);

router.get(
    "/transaction-trends",
    verifyToken,
    requireAnalyst,
    getTransactionTrends
);

router.get(
 "/trust-distribution",
 verifyToken,
 requireAnalyst,
 getTrustDistribution
);

router.get(
    "/fraud-trend",
    verifyToken,
    requireAnalyst,
    getFraudTrend
);

router.get(
 "/top-risk-users",
    verifyToken,    
    requireAnalyst,
 getTopRiskUsers
);

module.exports = router;