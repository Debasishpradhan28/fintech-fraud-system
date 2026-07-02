const pool =
require("../config/db");

const getDashboardData =
async(req,res)=>{

 try{

  const userId =
  req.user.id;

  const user =
  await pool.query(
  `
  SELECT
   u.full_name,
   a.account_number,
   a.balance,
   ts.score
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
   user.rows[0]
  );

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};

module.exports = {
 getDashboardData
};