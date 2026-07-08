const pool = require("../config/db");

// ===============================
// Grant Analyst Access
// ===============================

const grantAnalyst = async(req,res)=>{

try{

const {email}=req.body;

const user=await pool.query(

`
SELECT
id,
full_name,
email,
role
FROM users
WHERE LOWER(email)=LOWER($1)
`,

[email]

);

if(user.rows.length===0){

return res.status(404).json({

success:false,

message:"User not found."

});

}

if(user.rows[0].role==="ADMIN"){

return res.status(400).json({

success:false,

message:"Cannot change Admin role."

});

}

if(user.rows[0].role==="ANALYST"){

return res.status(400).json({

success:false,

message:"User is already an analyst."

});

}

await pool.query(

`
UPDATE users
SET role='ANALYST'
WHERE id=$1
`,

[user.rows[0].id]

);

res.json({

success:true,

message:"Analyst access granted."

});

}

catch(err){

console.log(err);

res.status(500).json({

success:false,

message:"Server Error"

});

}

};
const getAdminStats = async(req,res)=>{

try{

const totalUsers=await pool.query(

`SELECT COUNT(*) FROM users`

);

const analysts=await pool.query(

`SELECT COUNT(*) FROM users WHERE role='ANALYST'`

);

const admins=await pool.query(

`SELECT COUNT(*) FROM users WHERE role='ADMIN'`

);

res.json({

success:true,

stats:{

users:Number(totalUsers.rows[0].count),

analysts:Number(analysts.rows[0].count),

admins:Number(admins.rows[0].count)

}

});

}

catch(err){

console.log(err);

res.status(500).json({

success:false,

message:"Server Error"

});

}

};

// ===============================
// Get All Analysts
// ===============================

const getAnalysts = async(req,res)=>{

    try{

        const result=await pool.query(

            `
            SELECT
            id,
            full_name,
            email
            FROM users
            WHERE role='ANALYST'
            ORDER BY full_name
            `

        );

        res.json(result.rows);

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false

        });

    }

};

// ===============================
// Remove Analyst
// ===============================

const removeAnalyst=async(req,res)=>{

try{

const {id}=req.params;

const user=await pool.query(

`
SELECT role
FROM users
WHERE id=$1
`,

[id]

);

if(user.rows.length===0){

return res.status(404).json({

success:false,

message:"User not found."

});

}

if(user.rows[0].role!=="ANALYST"){

return res.status(400).json({

success:false,

message:"User is not an analyst."

});

}

await pool.query(

`
UPDATE users
SET role='CUSTOMER'
WHERE id=$1
`,

[id]

);

res.json({

success:true,

message:"Analyst removed."

});

}

catch(err){

console.log(err);

res.status(500).json({

success:false

});

}

};
const getUserByEmail = async (req,res)=>{

    try{

        const {email}=req.params;

        const result = await pool.query(

            `
            SELECT

            id,
            full_name,
            email,
            role

            FROM users

            WHERE LOWER(email)=LOWER($1)
            `,

            [email]

        );

        if(result.rows.length===0){

            return res.status(404).json({

                success:false,

                message:"User not found."

            });

        }

        res.json({

            success:true,

            user:result.rows[0]

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Server Error"

        });

    }

};
const searchUsers = async (req, res) => {

    try {

        const { query } = req.query;

        if (!query) {

            return res.json([]);

        }

        const result = await pool.query(

            `
            SELECT
                id,
                full_name,
                email,
                role
            FROM users
            WHERE
                LOWER(email) LIKE LOWER($1)
                OR LOWER(full_name) LIKE LOWER($1)
            ORDER BY full_name
            LIMIT 8
            `,

            [`%${query}%`]

        );

        res.json(result.rows);

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false

        });

    }

};

module.exports={

grantAnalyst,

getAnalysts,

removeAnalyst,
getUserByEmail,
getAdminStats,
searchUsers

};