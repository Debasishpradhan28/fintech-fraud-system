const pool = require("../config/db");

const createAccount = async (req, res) => {

    try {

        const userId = req.user.id;

        const accountNumber =
            "TG" +
            Date.now().toString().slice(-10);

        const result =
            await pool.query(
                `
                INSERT INTO accounts
                (
                    user_id,
                    account_number,
                    balance
                )
                VALUES
                (
                    $1,
                    $2,
                    $3
                )
                RETURNING *
                `,
                [
                    userId,
                    accountNumber,
                    0
                ]
            );

        res.status(201).json({
            success: true,
            account: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    createAccount
};