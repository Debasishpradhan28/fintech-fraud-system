const express=require("express");
const router=express.Router();
const verifyToken=require("../middleware/authMiddleware");
const requireAdmin=require("../middleware/adminMiddleware");
const { getPendingDeposits, handleDepositAction } = require("../controllers/depositController");
const authMiddleware = require("../middleware/authMiddleware");

const{
grantAnalyst,
getAnalysts,
removeAnalyst,
getUserByEmail,
getAdminStats,
searchUsers
}=require("../controllers/adminController");

router.patch(
"/grant",
verifyToken,
requireAdmin,
grantAnalyst
);

router.get(
"/analysts",
verifyToken,
requireAdmin,
getAnalysts
);

router.get(
"/user/:email",
verifyToken,
requireAdmin
);

router.patch(
"/remove/:id",
verifyToken,
requireAdmin,
removeAnalyst
);

router.get(
"/stats",
verifyToken,
requireAdmin,
getAdminStats
);

router.get(
"/search",
verifyToken,
requireAdmin,
searchUsers
);

router.get("/deposits/pending", authMiddleware, getPendingDeposits);
router.post("/deposits/action", authMiddleware, handleDepositAction);

module.exports=router;