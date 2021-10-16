let express = require("express");
const userModel = require("../model/userModal");
let { bodyChecker, protectRoute, isAuthorised } = require("./utilFunc");
let userRouter = express.Router();
const { createElement,
    getElement, getElements,
    updateElement,
    deleteElement } = require("../helper/factory");


userRouter.use(protectRoute);

let createUser = createElement(userModel);
let getUser = getElement(userModel);
let getUsers = getElements(userModel);
let updateUser = updateElement(userModel);
let deleteUser = deleteElement(userModel);

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