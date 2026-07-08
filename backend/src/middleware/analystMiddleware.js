const requireAnalyst = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });

    }

    if (
        req.user.role !== "ADMIN" &&
        req.user.role !== "ANALYST"
    ) {

        return res.status(403).json({
            success: false,
            message: "Analyst access required."
        });

    }

    next();

};

module.exports = requireAnalyst;