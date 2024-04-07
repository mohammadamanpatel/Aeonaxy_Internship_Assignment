const jwt = require('jsonwebtoken')

const isRegistered = async (req, res, next) => {
    try {
        console.log("from cookie", req.cookies);
        const jwtToken = req.cookies.jwtToken
        console.log("jwtToken--:>", jwtToken);
        if (!jwtToken) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing',
                jwtToken: jwtToken
            });
        }

        try {
            const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
            console.log("decode", decode);
            req.user = decode;
        }
        catch (err) {
            console.log(err);
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
                error: err.message
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while validating the token',
            error: error.message
        });
    }
}
const isSuperAdmin = async function (req, res, next) {
    try {
        console.log("req.user in auth middleware", req.user.role)
        if (req.user.role !== "superadmin") {
            return res.status(400).json({
                success: false,
                message: "This route is for Course superadmins Only"
            })
        }
        else {
            next();
        }
    }
    catch (Error) {
        console.log(Error.message);
        return res.status(500).json({
            success: false,
            message: Error.message
        })
    }
}
const isStudent = async function (req, res, next) {
    try {
        if (req.user.role !== 'user') {
            return res.status(400).json({
                success: false,
                message: "This route is for students"
            })
        }
        else {
            next();
        }
    }
    catch (Error) {
        console.log(Error.message);
        return res.status(500).json({
            success: false,
            message: Error.message
        })
    }
}
module.exports = {
    isRegistered,
    isSuperAdmin,
    isStudent
} 