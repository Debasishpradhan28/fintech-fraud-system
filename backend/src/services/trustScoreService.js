const updateTrustScore =
async (
 client,
 userId,
 riskScore
) => {

 let scoreChange = 0;

 if(riskScore < 30){

  scoreChange = 5;

 }
 else if(riskScore < 70){

  scoreChange = -10;

 }
 else{

  scoreChange = -25;

 }

 const trust =
 await client.query(
 `
 SELECT score
 FROM trust_scores
 WHERE user_id = $1
 `,
 [userId]
 );

 const currentScore =
 trust.rows[0]?.score || 500;

 const newScore =
 Math.max(
  0,
  Math.min(
   1000,
   currentScore + scoreChange
  )
 );

 await client.query(
 `
 UPDATE trust_scores
 SET score = $1,
     updated_at = NOW()
 WHERE user_id = $2
 `,
 [
  newScore,
  userId
 ]
 );

 await client.query(
 `
 INSERT INTO trust_score_history
 (
  user_id,
  score,
  reason
 )
 VALUES
 (
  $1,
  $2,
  $3
 )
 `,
 [
  userId,
  newScore,
  "Behavior Risk Update"
 ]
 );

 return newScore;

};

module.exports = {
    updateTrustScore
};