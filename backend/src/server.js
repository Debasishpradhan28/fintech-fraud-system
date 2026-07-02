const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const fraudRoutes = require("./routes/fraudRoutes");
const riskRoutes =require("./routes/riskRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const transactionHistoryRoutes = require("./routes/transactionHistoryRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/accounts",accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/fraud", fraudRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/transactions", transactionHistoryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "TrustGuard AI Backend Running"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});