
const jwt = require('jsonwebtoken');


const verify_token = (req, res, next) => {
    const auth_header = req.headers["authorization"];
    const token = auth_header && auth_header.split(" ")[1]; 

    if(!token) return res.status(401).json({ message: "Access token required" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.status(403).json({ message: "Invalid or expired token" });

        req.user = decoded;
        next();
    })
};

module.exports = { verify_token };