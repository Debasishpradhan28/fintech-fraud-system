const express = require("express");

const router = express.Router();
const auth =require("../middleware/authMiddleware");
const verifyToken = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");


const {
 getProfile,
 getBanking,
 searchUsers,
 updateProfile,
 changePassword,
 markNotificationsRead
}
=
require("../controllers/profileController");


router.get(
 "/me",
 verifyToken,
 getProfile
);
router.get(
 "/banking",
 verifyToken,
 getBanking
);
router.get(
 "/search",
 verifyToken,
 searchUsers
);
router.put(
 "/",
 auth,
 updateProfile
);
router.put(
 "/change-password",
 auth,
 changePassword
);
router.post('/notifications/clear', authMiddleware, markNotificationsRead);
module.exports = router;