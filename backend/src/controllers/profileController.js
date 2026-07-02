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
   email
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
   logins.rows

  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const getBanking = async (req,res)=>{

 try{

  const userId =
  req.user.id;

  const result =
  await pool.query(
  `
  SELECT

   u.full_name,

   a.account_number,

   a.balance,

   ts.score
   AS trust_score

  FROM users u

  JOIN accounts a
  ON u.id = a.user_id

  LEFT JOIN trust_scores ts
  ON u.id = ts.user_id

  WHERE u.id = $1
  `,
  [userId]
  );

  res.status(200).json(
   result.rows[0]
  );

 }catch(error){

  res.status(500).json({
   message:error.message
  });

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
 changePassword
};