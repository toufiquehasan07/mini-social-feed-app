const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            // email: user.email,
            // name: user.name
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
        }
    );
};

exports.generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            // email: user.email,
            // name: user.name
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        }
    );
}
