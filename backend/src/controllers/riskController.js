const pool = require("../config/db");

const getRiskyUsers = async (req, res) => {

  try {

    const users = await pool.query(
      `
      SELECT
        u.full_name,
        t.score
      FROM trust_scores t
      JOIN users u
      ON t.user_id = u.id
      ORDER BY t.score ASC
      LIMIT 10
      `
    );

    res.status(200).json({
      success: true,
      users: users.rows
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  getRiskyUsers
};