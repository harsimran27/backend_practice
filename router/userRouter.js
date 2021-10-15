let express = require("express");
let userRouter = express.Router();
const userModel = require("../userModal");
let { bodyChecker, protectRoute } = require("./utilFunc");

userRouter.use(protectRoute);

userRouter
    .route("/:id")
    .get(bodyChecker, getUser)
    .patch(bodyChecker, isAuthorised(["admin","ce"]), updateUser)
    .delete(bodyChecker, isAuthorised(["admin"]), deleteUser)


userRouter
    .route("/")
    .get(protectRoute, isAuthorised(["admin","ce"]), getUsers)
    .post(bodyChecker, isAuthorised(["admin"]), createUser);

async function createUser(req, res) {
    try {
        let user = await userModel.create(req.body);
        res.status(200).json({
            user: user,
        })
    } catch (err) {
        res.status(404).json({
            message: err.message,
        })
    }
}

async function getUsers(req, res) {
    try {
        let user = await userModel.find();
        res.status(200).json({
            message: user,
        })

    } catch (err) {
        res.status(404).json({
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
        res.status(404).json({
            message: err.message,
        })
    }
}

async function updateUser(req, res) {
    try {

        let { id } = req.params;

        if (req.body.password || req.body.confirmPassword) {
            res.json({
                message: "use forget password instead",
            })
        }

        let user = await userModel.findById(id);

        for (let key in req.body) {
            user[key] = req.body[key];
        }

        await user.save({
            validateBeforeSave: false,
        });

        res.status(200).json({
            message: user,
        })

    } catch (err) {
        res.status(404).json({
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
        res.status(404).json({
            message: err.message,
        })
    }
}

function isAuthorised(roles){
    return async function(req, res, next){
        let userId = req;

        try{
            let user = await userModel.findById(userId);

            let isUserAuthorised = roles.includes(user.role);
            if(isUserAuthorised){
                next();
                
            }else{
                res.status(200).json({
                    message:"user not authorised",
                })
            }
        }
        catch(err){
            res.status(500).json({
                message:err.message,
            })
        }
    }
}


module.exports = userRouter;