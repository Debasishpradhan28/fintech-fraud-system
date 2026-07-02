const pool = require("../config/db");

const getRiskDistribution =
async(req,res)=>{

 try{

  const result =
  await pool.query(
  `
  SELECT

  CASE

   WHEN risk_score < 30
   THEN 'Low'

   WHEN risk_score < 70
   THEN 'Medium'

   ELSE 'High'

  END AS risk_level,

  COUNT(*)::int AS count

  FROM transactions

  GROUP BY risk_level
  `
  );

  res.json(
   result.rows
  );

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const getTransactionTrends = async (req,res)=>{

 try{

  const result =
  await pool.query(
  `
  SELECT
  DATE(created_at) as day,
  COUNT(*) as count
  FROM transactions
  GROUP BY day
  ORDER BY day
  `
  );

  res.json(result.rows);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const getTrustDistribution =
async (req,res)=>{

 try{

  const result =
  await pool.query(
  `
  SELECT
  CASE
   WHEN score < 450
   THEN '400-450'

   WHEN score < 500
   THEN '450-500'

   ELSE '500+'
  END as range,

  COUNT(*) as users

  FROM trust_scores

  GROUP BY range
  `
  );

  res.json(result.rows);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const getFraudTrend =
async(req,res)=>{

 try{

  const result =
  await pool.query(
  `
  SELECT

   DATE(
    t.created_at
   ) AS day,

   COUNT(*)::int
   AS alerts

  FROM fraud_alerts fa

  JOIN transactions t
  ON fa.transaction_id = t.id

  GROUP BY day

  ORDER BY day
  `
  );

  res.json(
   result.rows
  );

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const getTopRiskUsers =
async(req,res)=>{

 try{

  const result =
  await pool.query(
  `
  SELECT

   u.full_name,

   a.account_number,

   ts.score,

   COALESCE(
    MAX(t.risk_score),
    0
   )
   AS highest_risk

  FROM users u

  JOIN accounts a
  ON u.id = a.user_id

  JOIN trust_scores ts
  ON u.id = ts.user_id

  LEFT JOIN transactions t
  ON
  a.id =
  t.sender_account_id

  GROUP BY

   u.full_name,
   a.account_number,
   ts.score

  ORDER BY
   highest_risk DESC

  LIMIT 5
  `
  );

  res.json(
   result.rows
  );

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
module.exports = {
 getRiskDistribution,
 getTransactionTrends,
 getTrustDistribution,
 getFraudTrend,
 getTopRiskUsers
};