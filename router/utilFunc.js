let jwt = require("jsonwebtoken");
let { JWT_SECRET } = require("../secret");
let userModel = require("../model/userModal");

module.exports.bodyChecker = function bodyChecker(req, res, next) {
    let isPresent = Object.keys(req.body);
    if (isPresent.length) {
        next();
    } else {
        res.send("send details in body");
    }
}

module.exports.protectRoute = function protectRoute(req, res, next) {
    try {

        let decreptedToken = jwt.verify(req.cookies.JWT, JWT_SECRET);
        if (decreptedToken) {
            let userId = decreptedToken.id;
            req.userId = userId;
            next();
        } else {
            res.send("kindly login to access this record");
        }

    } catch (err) {
        res.status(404)
            .json({
                message: err.message,
            })
    }
}

module.exports.isAuthorised = function isAuthorised(roles) {
    return async function (req, res, next) {
        let userId = req;

        try {
            let user = await userModel.findById(userId);

            let isUserAuthorised = roles.includes(user.role);
            if (isUserAuthorised) {
                next();

            } else {
                res.status(200).json({
                    message: "user not authorised",
                })
            }
        }
        catch (err) {
            res.status(500).json({
                message: err.message,
            })
        }
    }
}