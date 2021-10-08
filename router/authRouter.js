let express = require("express");
let authRouter = express.Router();
const userModel = require("../userModal");

authRouter
    .route("/signup")
    .post(bodyChecker, signupUser)

authRouter
    .route("/login")
    .post(bodyChecker, loginUser);

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

async function signupUser(req, res) {
    try {
        let newUser = await userModel.create(req.body);
        res.status(200).json({
            "message": "user created successfully",
            user: newUser,
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}

function loginUser(req, res) {
    try {
        let { email, password } = req.body;
        let obj = content.find((obj) => {
            return obj.email == email;
        })
        if (!obj) {
            return res
                .status(404)
                .send("user not found");
        }
        if (password == obj.password) {
            let token = jwt.sign({ email: obj.email }, JWT_SECRET);
            res.cookie("JWT", token);

            res.status(200)
                .send("user logged in");
        } else {
            res.status(422)
                .send("access denied. Enter correct email and password");
        }
    } catch (err) {
        res.status(404)
            .json({
                message: err.message,
            })
    }
}

module.exports = authRouter;