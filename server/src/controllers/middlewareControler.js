const jwt = require("jsonwebtoken");

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({ message: "Token is invalid" });
                }
                console.log(user);
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json({ message: "You are not authenticated" });
        }
    },
    verifyTokenAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.user_role == 'admin') {
                next();
            } else {
                res.status(403).json({ message: "You are not authenticated" });
            }
        });
    },
};

module.exports = middlewareController;
