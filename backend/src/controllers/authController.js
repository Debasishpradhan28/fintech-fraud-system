const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {

    try {
        await pool.query("BEGIN");
        const {
            full_name,
            email,
            password
        } = req.body;

        const existingUser =
            await pool.query(
                "SELECT * FROM users WHERE email=$1",
                [email]
            );

        if(existingUser.rows.length > 0){

            return res.status(400).json({
                message: "Email already exists"
            });

        }
        // Hash password
        const hashedPassword =await bcrypt.hash(password,10);
        // Save user
        const newUser =
            await pool.query(
                `INSERT INTO users
                (full_name,email,password_hash,role)
                VALUES($1,$2,$3,'CUSTOMER')
                RETURNING *`,
                [
                    full_name,
                    email,
                    hashedPassword
                ]
            );
            await pool.query(`INSERT INTO trust_scores(user_id,score) VALUES($1,$2)`,[newUser.rows[0].id,500]);
            const generateAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            await pool.query(
            `INSERT INTO accounts (user_id, account_number, balance, currency) 
             VALUES ($1, $2, $3, $4)`,
             [newUser.rows[0].id, generateAccountNumber, 0.00, 'USD']
            );
            await pool.query("COMMIT");

        res.status(201).json({
            success:true,
            user:newUser.rows[0]
        });
    } catch(error){
        await pool.query("ROLLBACK");
        console.error(error);
        res.status(500).json({
            message:"Server Error"
        });
    }
};

const loginUser = async (req, res) => {

    try {

        const { email, password,deviceFingerprint,location } = req.body;

        const userResult =
            await pool.query(
                "SELECT * FROM users WHERE email=$1",
                [email]
            );

        if(userResult.rows.length === 0){

            return res.status(400).json({
                message:"User not found"
            });

        }

        const user = userResult.rows[0];
        await pool.query(
`
INSERT INTO login_activity
(
    user_id,
    device_fingerprint,
    ip_address,
    location
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
    user.id,
    deviceFingerprint,
    req.ip,
    location
]
);
const existingDevice =
await pool.query(
`
SELECT *
FROM devices
WHERE user_id = $1
AND device_fingerprint = $2
`,
[
    user.id,
    deviceFingerprint
]
);
if(existingDevice.rows.length === 0){

    await pool.query(
    `
    INSERT INTO devices
    (
        user_id,
        device_fingerprint,
        ip_address,
        location
    )
    VALUES
    (
        $1,$2,$3,$4
    )
    `,
    [
        user.id,
        deviceFingerprint,
        req.ip,
        location
    ]
    );

}

        const isMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if(!isMatch){

            return res.status(400).json({
                message:"Invalid Password"
            });

        }

        const token = jwt.sign(
            {
                id:user.id,
                email:user.email,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );
    

        res.status(200).json({
            success:true,
            token,
            user:{
                id:user.id,
                name:user.full_name,
                email:user.email,
                role:user.role
            }
        });
    } catch(error){

        console.error(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};

module.exports = {
    registerUser,
    loginUser
};