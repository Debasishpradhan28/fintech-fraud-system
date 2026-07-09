const pool = require("../config/db");
const bcrypt = require("bcrypt")

const getProfile = async (req,res)=>{

 try{

  const userId = req.user.id;

  const user =
  await pool.query(
  `
  SELECT
   id,
   full_name,
   email,
   role
  FROM users
  WHERE id = $1
  `,
  [userId]
  );

  const trust =
  await pool.query(
  `
  SELECT score
  FROM trust_scores
  WHERE user_id = $1
  `,
  [userId]
  );

  const devices =
  await pool.query(
  `
  SELECT *
  FROM devices
  WHERE user_id = $1
  ORDER BY last_seen DESC
  `,
  [userId]
  );

  const unseenDeposits = await pool.query(
      `SELECT id FROM deposit_requests WHERE user_id = $1 AND status = 'APPROVED' AND is_notified = FALSE`, 
      [userId]
    );

  const logins =
  await pool.query(
  `
  SELECT *
  FROM login_activity
  WHERE user_id = $1
  ORDER BY login_time DESC
  LIMIT 10
  `,
  [userId]
  );
  console.log(req.user);

  res.status(200).json({

   user:user.rows[0],

   trustScore:
   trust.rows[0]?.score || 0,

   devices:
   devices.rows,

   logins:
   logins.rows,

   has_new_approved_funds: unseenDeposits.rows.length > 0

  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query(
      `UPDATE deposit_requests SET is_notified = TRUE WHERE user_id = $1 AND status = 'APPROVED'`,
      [userId]
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// backend/src/controllers/profileController.js

const getBanking = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Attempt to fetch existing account and trust score
    let result = await pool.query(
      `SELECT a.account_number, a.balance, ts.score as trust_score 
       FROM accounts a 
       LEFT JOIN trust_scores ts ON a.user_id = ts.user_id 
       WHERE a.user_id = $1`,
      [userId]
    );

    // 2. SELF-HEALING: If no account exists, create one immediately
    if (result.rows.length === 0) {
      const newAccNum = "TG" + Math.floor(1000000000 + Math.random() * 9000000000);
      
      // Create the missing account record
      await pool.query(
        "INSERT INTO accounts (user_id, account_number, balance) VALUES ($1, $2, 0.00)",
        [userId, newAccNum]
      );
      
      // Ensure trust_score exists as well
      await pool.query(
        "INSERT INTO trust_scores (user_id, score) VALUES ($1, 500) ON CONFLICT (user_id) DO NOTHING",
        [userId]
      );

      // 3. Re-fetch the newly created data to ensure accurate UI display
      result = await pool.query(
        `SELECT a.account_number, a.balance, COALESCE(ts.score, 500) as trust_score 
         FROM accounts a 
         LEFT JOIN trust_scores ts ON a.user_id = ts.user_id 
         WHERE a.user_id = $1`,
        [userId]
      );
    }

    // 4. Return the clean data
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("GET BANKING ERROR:", error);
    res.status(500).json({ message: "Failed to load banking data." });
  }
};
const searchUsers = async(req,res)=>{

 try{
    const userId = req.user.id;

  const searchTerm = req.query.query || "";

  const result =
  await pool.query(
  `
  SELECT

   u.id,
   u.full_name,
   u.email,
   a.account_number

  FROM users u

  JOIN accounts a
  ON u.id = a.user_id

  WHERE
  u.id != $2

AND

(
 u.email ILIKE $1
 OR
 u.full_name ILIKE $1
 OR
 a.account_number ILIKE $1
)

  LIMIT 5
  `,
  [`%${searchTerm}%`, userId]
  );

  res.status(200).json({
   users:result.rows
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const updateProfile =
async(req,res)=>{

 try{

  const {
   fullName,
   email
  }
  =
  req.body;

  await pool.query(
  `
  UPDATE users
  SET

   full_name=$1,
   email=$2

  WHERE id=$3
  `,
  [
   fullName,
   email,
   req.user.id
  ]
  );

  res.json({
   success:true
  });

 }catch(error){
  console.log(
   "UPDATE PROFILE ERROR:",
   error
  );

  res.status(500).json({
   message:error.message
  });

 }

};
const changePassword =
async(req,res)=>{

 try{

  const {
   currentPassword,
   newPassword
  }
  =
  req.body;

  const user =
  await pool.query(
  `
  SELECT *
  FROM users
  WHERE id = $1
  `,
  [req.user.id]
  );

  const valid =
  await bcrypt.compare(
   currentPassword,
   user.rows[0].password_hash
  );

  if(!valid){

   return res.status(400).json({
    message:
    "Current password incorrect"
   });

  }

  const hashed =
  await bcrypt.hash(
   newPassword,
   10
  );

  await pool.query(
  `
  UPDATE users
  SET password_hash = $1
  WHERE id = $2
  `,
  [
   hashed,
   req.user.id
  ]
  );

  res.json({
   success:true
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
module.exports = {
 getProfile,
 getBanking,
 searchUsers,
 updateProfile,
 changePassword,
  markNotificationsRead
};