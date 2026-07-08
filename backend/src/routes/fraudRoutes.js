const express = require("express");

const router = express.Router();
const auth = require("../middleware/authMiddleware");
const verifyToken =require("../middleware/authMiddleware");
const requireAnalyst = require("../middleware/analystMiddleware");

const {

    getHighRiskTransactions,
    getFraudAlerts,
    getRiskyUsers,
    getFraudSummary,
    getInvestigationDetails,
    updateAlertStatus,
    getInvestigationNetwork,
    getAccountIntelligence,
    getUserRiskTimeline,
    getInvestigationQueue,
    getInvestigationTimeline
}
=
require("../controllers/fraudController");

router.get(
    "/high-risk",
    verifyToken,
    requireAnalyst,
    getHighRiskTransactions
);

router.get(
    "/alerts",
    verifyToken,
    requireAnalyst,
    getFraudAlerts
);

router.get(
    "/risky-users",
    verifyToken,
    requireAnalyst,
    getRiskyUsers
);

router.get(
    "/summary",
    verifyToken,
    requireAnalyst,
    getFraudSummary
);
router.get(
 "/investigation/:id",
 verifyToken,
 requireAnalyst,
 getInvestigationDetails
);
router.put(
 "/alerts/:id/status",
 verifyToken,
 requireAnalyst,
 updateAlertStatus
);
router.get(
 "/network/:id",
 verifyToken,
 requireAnalyst,
 getInvestigationNetwork
);
router.get(
 "/intelligence/:accountId",
 verifyToken,
 requireAnalyst,
 getAccountIntelligence
);
router.get(
 "/timeline/:userId",
 verifyToken,
 requireAnalyst,
 getUserRiskTimeline
);
router.get(
 "/investigations",
 verifyToken,
 requireAnalyst,
 getInvestigationQueue
);
router.get(
 "/investigation/:id/timeline",
 verifyToken,
 requireAnalyst,
 getInvestigationTimeline
);


module.exports = router;