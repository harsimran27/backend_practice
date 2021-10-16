let express = require("express");
const userModel = require("../userModal");
let { bodyChecker, protectRoute } = require("./utilFunc");
let userRouter = express.Router();

let createUser = createElement(userModel);
let getUser = getElement(userModel);
let getUsers = getElements(userModel);
let updateUser = updateElement(userModel);
let deleteUser = deleteElement(userModel);

userRouter.use(protectRoute);

userRouter
    .route("/:id")
    .get(bodyChecker, getUser)
    .patch(bodyChecker, isAuthorised(["admin", "ce"]), updateUser)
    .delete(bodyChecker, isAuthorised(["admin"]), deleteUser)

userRouter
    .route("/")
    .get(protectRoute, isAuthorised(["admin", "ce"]), getUsers)
    .post(bodyChecker, isAuthorised(["admin"]), createUser);

module.exports = userRouter;