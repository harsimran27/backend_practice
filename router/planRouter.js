const express = require("express");
const planModel = require("../model/planModel");
const { bodyChecker, protectRoute, isAuthorised } = require("./utilFunc");

const planRouter = express.Router();

planRouter.use(protectRoute);

planRouter
    .route("/plan")
    .post(bodyChecker, isAuthorised["admin"], createPlan);

module.exports = planRouter;