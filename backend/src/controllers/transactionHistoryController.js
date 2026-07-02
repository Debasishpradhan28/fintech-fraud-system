const pool = require("../config/db");

const getTransactions = async (req,res)=>{

 try{

  const result =
  await pool.query(
  `
  SELECT
  transaction_reference,
  amount,
  risk_score,
  status,
  created_at

  FROM transactions

  ORDER BY created_at DESC
  `
  );

  res.status(200).json({
   success:true,
   transactions:result.rows
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};

module.exports = {
 getTransactions
};