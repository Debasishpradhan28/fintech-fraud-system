const express = require("express");

const router = express.Router();
const auth = require("../middleware/authMiddleware");
const verifyToken =
require("../middleware/authMiddleware");

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
    getHighRiskTransactions
);

router.get(
    "/alerts",
    verifyToken,
    getFraudAlerts
);

router.get(
    "/risky-users",
    verifyToken,
    getRiskyUsers
);

router.get(
    "/summary",
    verifyToken,
    getFraudSummary
);
router.get(
 "/investigation/:id",
 verifyToken,
 getInvestigationDetails
);
router.put(
 "/alerts/:id/status",
 verifyToken,
 updateAlertStatus
);
router.get(
 "/network/:id",
 verifyToken,
 getInvestigationNetwork
);
router.get(
 "/intelligence/:accountId",
 verifyToken,
 getAccountIntelligence
);
router.get(
 "/timeline/:userId",
 verifyToken,
 getUserRiskTimeline
);
router.get(
 "/investigations",
 verifyToken,
 getInvestigationQueue
);
router.get(
 "/investigation/:id/timeline",
 verifyToken,
 getInvestigationTimeline
);


module.exports = router;