let express = require("express");
let userRouter = express.Router();
let fs = require("fs");

userRouter
    .route("/")
    .post(bodyChecker, createUser);

userRouter
    .route("/")
    .get(protectRoute, getUsers)

function getUsers(req, res) {
    res.status(200).json({
        message: content
    });
}

function createUser(req, res) {
    let body = req.body;
    content.push(body);
    console.log(content);
    fs.writeFileSync("./data.json", JSON.stringify(content));
    res.json({
        message: content
    })
}

function bodyChecker(req, res, next) {
    let isPresent = Object.keys(req.body);
    if (isPresent.length) {
        next();
    } else {
        res.send("send details in body");
    }
}

function protectRoute(req, res, next) {
    try {

        let decreptedToken = jwt.verify(req.cookies.JWT, JWT_SECRET);
        if (decreptedToken) {
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


module.exports = userRouter;