const express = require("express");
const planModel = require("../model/planModel");
const { bodyChecker, protectRoute, isAuthorised } = require("./utilFunc");
const { createElement,
    getElement, getElements,
    updateElement,
    deleteElement } = require("../helper/factory");

const planRouter = express.Router();

const createPlan = createElement(planModel);
let getPlan = getElement(planModel);
let getPlans = getElements(planModel);
let updatePlan = updateElement(planModel);
let deletePlan = deleteElement(planModel);

planRouter.use(protectRoute);

planRouter
    .route("/:id")
    .get(bodyChecker, getPlan)
    .patch(bodyChecker, isAuthorised(["admin", "ce"]), updatePlan)
    .delete(bodyChecker, isAuthorised(["admin"]), deletePlan)

planRouter
    .route("/")
    .get(protectRoute, isAuthorised(["admin", "ce"]), getPlans)
    .post(bodyChecker, isAuthorised(["admin"]), createPlan);

module.exports = planRouter;