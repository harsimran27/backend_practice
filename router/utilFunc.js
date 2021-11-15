let jwt = require("jsonwebtoken");
let { JWT_SECRET } = process.env 
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

module.exports.isAuthorised = function (roles) {
    console.log("I will run when the server is started")
    // function call 
    console.log()
    return async function (req, res, next) {
        console.log("Inner function");
        let { userId } = req;
        // id -> user get ,user role,
        try {
            let user = await userModel.findById(userId);
            let userisAuthorized = roles.includes(user.role);
            if (userisAuthorized) {
                req.user = user;
                next();
            } else {
                res.status(200).json({
                    message: "user not authorized"
                })
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }

}
