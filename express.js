const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require("cookie-parser");

const Port = process.env.PORT || 3002;

const userRouter = require("./router/userRouter");
const authRouter = require("./router/authRouter");
const planRouter = require("./router/planRouter");
const reviewRouter = require("./router/reviewRouter");
const bookingRouter = require("./router/bookingRouter");


app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/plan", planRouter);
app.use("/api/review", reviewRouter);
app.use("/api/booking", bookingRouter);

app.listen(Port, function () {
    console.log(`server started at port ${Port}`);
})

app.use(function (req, res) {
    let restOfPath = path.join("./public", "404.html");
    res.status(404).sendFile
        (path.join(__dirname, restOfPath));
})