const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./secret");

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
// console.log(__dirname);

// app.get("/", (req, res) => {
//     // let body = req.body;
//     let content = JSON.parse(fs.readFileSync("./data.json"));
//     res.status(200).json({
//         content: content,
//     })
// })

// app.post("/", function (req, res, next) {
//     let body = req.body;
//     console.log("body", body);
//     next();
// })

// app.post("/", function (req, res, next) {
//     let body = req.body;
//     res.json({
//         message: body
//     })
//     console.log("body", body);
// })

let content = JSON.parse(fs.readFileSync("./data.json"));
// console.log(content);

let userRouter = express.Router();
let authRouter = express.Router();

app.use("/user", userRouter);
app.use("/auth", authRouter);

userRouter
    .route("/")
    .post(bodyChecker, createUser);

userRouter
    .route("/")
    .get(protectRoute, getUsers)

authRouter
    .route("/signup")
    .post(bodyChecker, signupUser)

authRouter
    .route("/login")
    .post(bodyChecker, loginUser);

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

function signupUser(req, res) {
    try {
        let { name, email, password, confirmPassword } = req.body;
        if (password == confirmPassword) {

            let newUser = { name, email, password };

            content.push(newUser);
            fs.writeFileSync("data.json", JSON.stringify(content));
            res.status(200).json({
                createUser: newUser
            })
        } else {
            res.status(422).send("data not matched");
        }
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

app.listen("8000", function () {
    console.log('server started at port 8000');
})

app.use(function (req, res) {
    let restOfPath = path.join("./public", "404.html");
    res.status(404).sendFile
        (path.join(__dirname, restOfPath));
})