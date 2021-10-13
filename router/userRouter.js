let express = require("express");
let userRouter = express.Router();

let { bodyChecker, protectRoute } = require("./utilFunc");

let fs = require("fs");

userRouter.use(protectRoute);
userRouter
    .route("/:id")
    .get(bodyChecker, getUser)
    .patch(bodyChecker, updateUser)
    .delete(bodyChecker, deleteUser)


userRouter
    .route("/")
    .get(protectRoute, getUsers)
    .post(bodyChecker, createUser);

async function createUser(req, res) {
    try {
        let user = await userModel.create(req.body);
        res.status(200).json({
            user: user,
        })
    } catch (err) {
        res.statu(404).json({
            message: err.message,
        })
    }
}

function getUsers(req, res) {
    try {
        let user = await userModel.find();
        res.status(200).json({
            message: user,
        })

    } catch (err) {
        res.statu(404).json({
            message: err.message,
        })
    }
}

async function getUser(req, res) {
    try {
        let { id } = req.params;
        let user = await userModel.findById(id);
        res.status(200).json({
            message: user,
        })

    } catch (err) {
        res.statu(404).json({
            message: err.message,
        })
    }
}

async function updateUser(req, res) {
    try {

        let {id} = req.params;
        let user = await userModel.findById(id);

        for(let key in req.body){
            user[key] = req.body[key];
        }

        await user.save();

        res.status(200).json({
            message: user,
        })

    } catch (err) {
        res.statu(404).json({
            message: err.message,
        })
    }
}

async function deleteUser(req, res) {
    try {
        let { id } = req.params;
        let user = await userModel.findByIdAndDelete(id);
        res.status(200).json({
            message: user,
        })

    } catch (err) {
        res.statu(404).json({
            message: err.message,
        })
    }
}


module.exports = userRouter;