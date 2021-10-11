let express = require("express");
let userRouter = express.Router();

let { bodyChecker, protectRoute } = require("./utilFunc");

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

module.exports = userRouter;