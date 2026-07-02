const pool = require("../config/db");

const getHighRiskTransactions =
async (req,res) => {

    try {

        const result =
        await pool.query(
        `
        SELECT *
        FROM transactions
        WHERE risk_score >= 70
        ORDER BY created_at DESC
        `
        );

        res.status(200).json({
            success:true,
            count:result.rows.length,
            transactions:result.rows
        });

    } catch(error){

        console.error(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};
const getFraudAlerts =
async (req,res) => {

    try {

        const result =
        await pool.query(
        `
        SELECT *
        FROM fraud_alerts
        ORDER BY created_at DESC
        `
        );

        res.status(200).json({
            success:true,
            alerts:result.rows
        });

    } catch(error){

        console.error(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};
const getRiskyUsers =
async (req,res) => {

    try {

        const result =
        await pool.query(
        `
        SELECT
            u.id,
            u.full_name,
            u.email,
            ts.score
        FROM users u
        JOIN trust_scores ts
        ON u.id = ts.user_id
        ORDER BY ts.score ASC
        `
        );

        res.status(200).json({
            success:true,
            users:result.rows
        });

    } catch(error){

        console.error(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};
const getFraudSummary =
async (req,res) => {

    try {

        const totalTransactions =
        await pool.query(
        `
        SELECT COUNT(*)
        FROM transactions
        `
        );

        const highRiskTransactions =
        await pool.query(
        `
        SELECT COUNT(*)
        FROM transactions
        WHERE risk_score >= 70
        `
        );

        const fraudAlerts =
        await pool.query(
        `
        SELECT COUNT(*)
        FROM fraud_alerts
        `
        );

        const avgTrust =
        await pool.query(
        `
        SELECT AVG(score)
        FROM trust_scores
        `
        );

        res.status(200).json({

            totalTransactions:
            totalTransactions.rows[0].count,

            highRiskTransactions:
            highRiskTransactions.rows[0].count,

            fraudAlerts:
            fraudAlerts.rows[0].count,

            averageTrustScore:
            Number(
                avgTrust.rows[0].avg
            ).toFixed(2)

        });

    } catch(error){

        console.error(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};
const getInvestigationDetails =
async (req,res)=>{

 try{

  const { id } = req.params;

  const result =
  await pool.query(
  `
  SELECT

   fa.id,
   fa.alert_type,
   fa.severity,
   fa.risk_score,
   fa.investigation_status,
   fa.created_at,
   fa.updated_at,

   t.transaction_reference,
   t.amount,
   t.status,

   sa.id as sender_account,
   ra.id as receiver_account,

   d.device_fingerprint,
   d.last_seen,
   d.location,
   d.ip_address

  FROM fraud_alerts fa

  JOIN transactions t
  ON fa.transaction_id = t.id

  JOIN accounts sa
  ON t.sender_account_id = sa.id

  JOIN accounts ra
  ON t.receiver_account_id = ra.id

  LEFT JOIN devices d
  ON sa.user_id = d.user_id

  WHERE fa.id = $1

  ORDER BY d.last_seen DESC

  LIMIT 1
  `,
  [id]
  );

  if(result.rows.length===0){

   return res.status(404).json({
    message:"Alert not found"
   });

  }

 const details = result.rows[0];

 details.risk_breakdown = [];

 if(details.amount >= 50000){

   details.risk_breakdown.push({
   title:"Large Transaction",
   description: `Amount ₹${details.amount} exceeds ₹50,000 threshold`,
   score:100,
   severity:"HIGH"
 });
}

if(details.risk_score > 100){

 details.risk_breakdown.push({
  title:"Behavior Anomaly",
  description: "Unusual transaction behavior detected",
  score: details.risk_score - 100,
  severity:"MEDIUM"
 });

}

 res.status(200).json(details);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const updateAlertStatus =
async (req,res)=>{

 try{

  const { id } = req.params;

  const { status, notes } = req.body;

  await pool.query(
`
UPDATE fraud_alerts
SET

 investigation_status = $1,
 notes =COALESCE( $2,notes),

 updated_at = NOW()

WHERE id = $3
`,
[
 status,
 notes,
 id
]
);
if(status === "RESOLVED"){

 await pool.query(
 `
 UPDATE fraud_alerts
 SET updated_at = NOW()
 WHERE id = $1
 `,
 [id]
 );

}
await pool.query(
`
INSERT INTO investigation_history
(
 alert_id,
 action,
 performed_by
)
VALUES
(
 $1,
 $2,
 $3
)
`,
[
 id,
 `Status changed to ${status}`,
 req.user.email
]
);
if(notes){

 await pool.query(
 `
 INSERT INTO investigation_history
 (
  alert_id,
  action,
  performed_by
 )
 VALUES
 (
  $1,
  $2,
  $3
 )
 `,
 [
  id,
  "Analyst note updated",
  req.user.email
 ]
 );

}

  res.status(200).json({
   success:true
  });

 }catch(error){
    console.error(
   "UPDATE ALERT ERROR:",
   error
  );

  res.status(500).json({
   message:error.message
  });

 }

};
const getInvestigationTimeline =
async(req,res)=>{

 try{

  const { id } =
  req.params;

  const result =
  await pool.query(
  `
  SELECT *
  FROM investigation_history
  WHERE alert_id = $1
  ORDER BY created_at DESC
  `,
  [id]
  );

  res.status(200).json({
   history:
   result.rows
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const getInvestigationNetwork =
async (req,res)=>{
    const { id } = req.params;
console.log("API HIT");
console.log("Requested ID:", id);
 try{
const investigation =
await pool.query(
    
`
SELECT

fa.id,

fa.transaction_id,

t.sender_account_id,

t.receiver_account_id,

t.amount,

t.risk_score

FROM fraud_alerts fa

LEFT JOIN transactions t

ON fa.transaction_id=t.id

WHERE fa.id=$1
`,
[id]
);
console.log("Investigation Rows:");
console.log(investigation.rows);
if (investigation.rows.length === 0) {

    return res.status(404).json({
        success: false,
        message: "Investigation not found",
        investigationId: id
    });

}
const mainAccountId =investigation.rows[0].sender_account_id;
  const result =
  await pool.query(
  `
  SELECT

   t.id,
   t.amount,
   t.created_at,
   t.risk_score,

   sa.account_number
   AS sender_account,

   ra.account_number
   AS receiver_account

  FROM transactions t

  JOIN accounts sa
  ON t.sender_account_id = sa.id

  JOIN accounts ra
  ON t.receiver_account_id = ra.id

  WHERE

   t.sender_account_id = $1

   OR

   t.receiver_account_id = $1

  ORDER BY t.created_at DESC

  LIMIT 20
  `,
  [mainAccountId]
  );
  console.log("Network Transactions:");
console.table(result.rows);

const patterns=[];
const recommendations=[];
const aiSummary="AI analysis not generated yet.";

const accountInfo =
await pool.query(
`
SELECT

a.id,

a.account_number,

a.balance,

ts.score
AS trust_score,

COUNT(DISTINCT t.id)
AS total_transactions,

SUM(

CASE

WHEN
t.receiver_account_id=a.id

THEN t.amount

ELSE 0

END

)

AS total_received,

SUM(

CASE

WHEN
t.sender_account_id=a.id

THEN t.amount

ELSE 0

END

)

AS total_sent

FROM accounts a

LEFT JOIN trust_scores ts

ON ts.user_id=a.user_id

LEFT JOIN transactions t

ON

t.sender_account_id=a.id

OR

t.receiver_account_id=a.id

WHERE a.id=$1

GROUP BY

a.id,

ts.score
`,
[
mainAccountId
]
);
if (accountInfo.rows.length === 0) {
    return res.status(404).json({
        success: false,
        message: "Account not found"
    });
}
const mainAccountNumber = accountInfo.rows[0].account_number;
const nodes = new Map();

result.rows.forEach((txn)=>{

 if(!nodes.has(txn.sender_account)){

  nodes.set(
  txn.sender_account,
  {
    id: txn.sender_account,
    label: txn.sender_account,
    type:
      txn.sender_account === mainAccountNumber
        ? "MAIN"
        : "CONNECTED",

    riskScore: txn.risk_score
  }
);

 }

 if(!nodes.has(txn.receiver_account)){

  nodes.set(
  txn.receiver_account,
  {
    id: txn.receiver_account,
    label: txn.receiver_account,
    type:
      txn.receiver_account === mainAccountNumber
        ? "MAIN"
        : "CONNECTED",

    riskScore: txn.risk_score
  }
);

 }

});
const edges = result.rows.map(txn=>({

 id: `edge-${txn.id}`,

 source: txn.sender_account,

 target: txn.receiver_account,

 amount: txn.amount,

 risk: txn.risk_score,

 created_at: txn.created_at

}));
const metrics={

 totalAccounts: nodes.size,

 totalTransactions: result.rows.length,

 totalAmount: result.rows.reduce(

 (sum,txn)=>

 sum+Number(txn.amount),

 0

 ),

 highRiskTransactions:

 result.rows.filter(

 txn=>txn.risk_score>=100

 ).length

};
const timeline =
result.rows.map(txn=>({

 id:txn.id,

 title:

 `${txn.sender_account}
 → ${txn.receiver_account}`,

 description:

 `₹${Number(txn.amount).toLocaleString()}`,

 risk: txn.risk_score,

 created_at: txn.created_at

}));
  res.status(200).json({

 success:true,

 investigation: investigation.rows[0],

 account: accountInfo.rows[0],

 metrics,

 nodes:
 [...nodes.values()],

 edges,

 timeline,

 patterns,

 recommendations,

 aiSummary

});

 }catch(error){
  console.error(error);
  res.status(500).json({
    success : false,
   message:error.message,
   stack : error.stack
  });

 }

};
const getAccountIntelligence =
async (req,res)=>{

 try{

  const { accountId } = req.params;

  const result =
  await pool.query(
  `
  SELECT

   a.account_number,

   COUNT(
    CASE
     WHEN t.sender_account_id = a.id
     THEN 1
    END
   ) as sent_transactions,

   COUNT(
    CASE
     WHEN t.receiver_account_id = a.id
     THEN 1
    END
   ) as received_transactions,

   COALESCE(
    SUM(
     CASE
      WHEN t.sender_account_id = a.id
      THEN t.amount
     END
    ),
    0
   ) as total_sent,

   COALESCE(
    SUM(
     CASE
      WHEN t.receiver_account_id = a.id
      THEN t.amount
     END
    ),
    0
   ) as total_received,

   ts.score as trust_score

  FROM accounts a

  LEFT JOIN transactions t
  ON
   a.id = t.sender_account_id
   OR
   a.id = t.receiver_account_id

  LEFT JOIN trust_scores ts
  ON a.user_id = ts.user_id

  WHERE a.id = $1

  GROUP BY
   a.account_number,
   ts.score
  `,
  [accountId]
  );

  const data =
  result.rows[0];

  let riskLevel = "LOW";

  if(data.trust_score < 450){

   riskLevel = "HIGH";

  }
  else if(
   data.trust_score < 500
  ){

   riskLevel = "MEDIUM";

  }

  res.status(200).json({

   ...data,

   risk_level:riskLevel

  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const getUserRiskTimeline =
async (req,res)=>{

 try{

  const { userId } =
  req.params;

  const result =
  await pool.query(
  `
  SELECT
   score,
   reason,
   created_at
  FROM trust_score_history
  WHERE user_id = $1
  ORDER BY created_at DESC
  LIMIT 20
  `,
  [userId]
  );

  res.status(200).json({
   success:true,
   history:result.rows
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
const getInvestigationQueue =
async (req,res)=>{

 try{

  const result =
  await pool.query(
  `
  SELECT

   fa.id,

   fa.alert_type,

   fa.severity,

   fa.risk_score,

   fa.investigation_status,

   fa.created_at,

   t.transaction_reference,

   t.amount

  FROM fraud_alerts fa

  JOIN transactions t
  ON fa.transaction_id=t.id

  ORDER BY

   CASE

    WHEN
    fa.investigation_status='OPEN'
    THEN 1

    WHEN
    fa.investigation_status='UNDER REVIEW'
    THEN 2

    ELSE 3

   END,

   fa.risk_score DESC

  `
  );

  res.status(200).json({
   alerts:result.rows
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};
module.exports = {
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
};