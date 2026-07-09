const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../config/db");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. User initiates deposit (Creates Razorpay Order)
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise (multiply by 100)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// 2. User completes payment (Verifies & creates Pending Request)
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, account_number } = req.body;
    const userId = req.user.id;

    // Verify signature to ensure payment is legit
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Insert into deposit_requests as PENDING
    await pool.query(
      `INSERT INTO deposit_requests (user_id, account_number, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')`,
      [userId, account_number, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature]
    );

    res.status(200).json({ success: true, message: "Payment sent for admin verification" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Admin fetches pending deposits
const getPendingDeposits = async (req, res) => {
  try {
    const pending = await pool.query(`
      SELECT d.*, u.full_name, u.email 
      FROM deposit_requests d
      JOIN users u ON d.user_id = u.id
      WHERE d.status = 'PENDING'
      ORDER BY d.created_at ASC
    `);
    res.status(200).json(pending.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 4. Admin Approves or Rejects
const handleDepositAction = async (req, res) => {
  const { deposit_id, action } = req.body;

  try {
    // 1. Fetch the deposit details
    const depositRes = await pool.query("SELECT * FROM deposit_requests WHERE id = $1", [deposit_id]);
    const deposit = depositRes.rows[0];

    if (!deposit) return res.status(404).json({ message: "Deposit request not found" });
    if (deposit.status !== 'PENDING') return res.status(400).json({ message: "Deposit already processed" });

    // 2. Start Transaction
    await pool.query("BEGIN");

    if (action === 'APPROVE') {
      // Step A: Update deposit status
      await pool.query("UPDATE deposit_requests SET status = 'APPROVED' WHERE id = $1", [deposit_id]);
      
      // Step B: ADD MONEY TO THE ACCOUNT (This is the missing piece!)
      await pool.query(
        "UPDATE accounts SET balance = balance + $1 WHERE user_id = $2", 
        [deposit.amount, deposit.user_id]
      );
    } else if (action === 'REJECT') {
      await pool.query("UPDATE deposit_requests SET status = 'REJECTED' WHERE id = $1", [deposit_id]);
    }

    // 3. Commit Transaction
    await pool.query("COMMIT");
    res.status(200).json({ success: true, message: `Deposit successfully ${action}D` });

  } catch (error) {
    await pool.query("ROLLBACK"); // Revert if anything fails
    console.error("Action Error:", error);
    res.status(500).json({ message: "Failed to process deposit" });
  }
};

module.exports = { createOrder, verifyPayment, getPendingDeposits, handleDepositAction };