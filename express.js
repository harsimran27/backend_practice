const { json } = require('express');
const express = require('express');
const fs = require('fs');
const { nextTick } = require('process');
const app = express();

app.use(express.json());

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
console.log(content);

let userRouter = express.Router();
app.use("/user", userRouter);

userRouter
    .route("/")
    .post(createUser);

function createUser(req, res) {
    let body = req.body;
    content.push(body);
    console.log(content);
    fs.writeFileSync("./data.json", JSON.stringify(content));
    res.json({
        message: content
    })
}

app.listen("8000", function () {
    console.log('server started at port 8000');
})