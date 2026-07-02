const pool = require("../config/db");
const {
    calculateRiskScore
} = require("../services/riskEngine");
const {updateTrustScore}=require( "../services/trustScoreService");
const {
 calculateBehaviorRisk
}
=
require(
 "../services/behaviorService"
);

const transferMoney = async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            receiverAccountNumber,
            amount,
            remark
        } = req.body;
        const userId = req.user.id;

        await client.query("BEGIN");

        const sender =
await client.query(
`
SELECT *
FROM accounts
WHERE user_id = $1
`,
[userId]
);

        if(sender.rows.length === 0){

            throw new Error("Sender not found");

        }

        if(
            Number(sender.rows[0].balance)
            < Number(amount)
        ){
            throw new Error(
                "Insufficient balance"
            );
        }

        const receiver =
            await client.query(
                `
                SELECT * FROM accounts
                WHERE account_number = $1
                `,
                [receiverAccountNumber]
            );
            if(
 sender.rows[0].id ===
 receiver.rows[0].id
){

 throw new Error(
  "Cannot transfer to your own account"
 );

}

        if(receiver.rows.length === 0){

            throw new Error(
                "Receiver not found"
            );

        }

        await client.query(
            `
            UPDATE accounts
            SET balance = balance - $1
            WHERE id = $2
            `,
            [
                amount,
                sender.rows[0].id
            ]
        );

        await client.query(
            `
            UPDATE accounts
            SET balance = balance + $1
            WHERE id = $2
            `,
            [
                amount,
                receiver.rows[0].id
            ]
        );

        const transactionRef =
            "TXN" + Date.now();

        const riskScore = calculateRiskScore(amount);
        const behaviorRisk =
await calculateBehaviorRisk(
    client,
    sender.rows[0].user_id,
    "Windows-Chrome",
    "Odisha"
);

const finalRisk =
riskScore + behaviorRisk;
        await updateTrustScore(
    client,
    sender.rows[0].user_id,
    finalRisk
);

        const transaction =
            await client.query(
                `
                INSERT INTO transactions
                (
                    sender_account_id,
                    receiver_account_id,
                    amount,
                    status,
                    transaction_reference,
                    risk_score,remark
                )
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,$7
                )
                RETURNING *
                `,
                [
                    sender.rows[0].id,
                    receiver.rows[0].id,
                    amount,
                    "SUCCESS",
                    transactionRef,
                    finalRisk,remark
                ]
            );
            console.log("riskScore =", riskScore);
            console.log("behaviorRisk =", behaviorRisk);
            console.log("finalRisk =", finalRisk);
            if(finalRisk > 70){

    await client.query(
        `
        INSERT INTO fraud_alerts
        (
            transaction_id,
            alert_type,
            severity,
            risk_score
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )
        `,
        [
            transaction.rows[0].id,
            "Large Transaction",
            "HIGH",
            finalRisk
        ]
    );

}

        await client.query("COMMIT");

        res.status(200).json({
            success:true,
            transaction:
            transaction.rows[0]
        });

    } catch(error){

        await client.query(
            "ROLLBACK"
        );

        res.status(400).json({
            message:error.message
        });

    } finally {

        client.release();

    }

};
const getTransactionHistory =
async (req,res)=>{

 try{

  const userId =
  req.user.id;

  const result =
  await pool.query(
  `
  SELECT

 t.id,
 t.amount,
 t.status,
 t.risk_score,
 t.remark,
 t.transaction_reference,
 t.created_at,

 sa.account_number
 AS sender_account,

 ra.account_number
 AS receiver_account,

 CASE
  WHEN sa.user_id = $1
  THEN 'SENT'
  ELSE 'RECEIVED'
 END AS transaction_type

FROM transactions t

JOIN accounts sa
ON t.sender_account_id = sa.id

JOIN accounts ra
ON t.receiver_account_id = ra.id

WHERE
 sa.user_id = $1
 OR
 ra.user_id = $1

ORDER BY t.created_at DESC
  `,
  [userId]
  );
  

  res.status(200).json({
    

   success:true,

   transactions:
   result.rows
   

  });

 }catch(error){
    console.log(error);

  res.status(500).json({
   message:error.message
  });

 }

};
const getAllTransactions =
async(req,res)=>{

 try{

  const result =
  await pool.query(
  `
  SELECT

   t.id,

   t.amount,

   t.status,

   t.risk_score,

   t.remark,

   t.transaction_reference,

   t.created_at,

   sa.account_number
   AS sender_account,

   ra.account_number
   AS receiver_account

  FROM transactions t

  JOIN accounts sa
  ON t.sender_account_id = sa.id

  JOIN accounts ra
  ON t.receiver_account_id = ra.id

  ORDER BY
  t.created_at DESC
  `
  );

  res.status(200).json({

   success:true,

   transactions:
   result.rows

  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const getRecentRecipients =
async(req,res)=>{

 try{

  const userId =
  req.user.id;

  const result =
  await pool.query(
  `
  SELECT DISTINCT ON(a.account_number)

   a.account_number,

   u.full_name,

   t.amount AS last_amount,

   t.remark AS last_remark,

   t.created_at AS last_transfer_date

  FROM transactions t

  JOIN accounts sa
  ON t.sender_account_id = sa.id

  JOIN accounts a
  ON t.receiver_account_id = a.id

  JOIN users u
  ON a.user_id = u.id

  WHERE sa.user_id = $1

  ORDER BY
  a.account_number,
  t.created_at DESC

  LIMIT 5
  `,
  [userId]
  );

  res.json({
   recipients:
   result.rows
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};

module.exports = {
    transferMoney,
    getTransactionHistory,
    getAllTransactions,
    getRecentRecipients
};