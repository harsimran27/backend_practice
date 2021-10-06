const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static("public"));
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

authRouter
    .route("/signup")
    .post(bodyChecker, signupUser)

authRouter
    .route("/login")
    .post(bodyChecker, loginUser);

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
            res
                .status(200)
                .send("user logged in");
        } else {
            res
                .status(422)
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