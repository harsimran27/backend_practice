const express = require("express");
const planModel = require("../model/planModel");
const { bodyChecker, protectRoute, isAuthorised } = require("./utilFunc");

const { createElement,
    getElement, getElements,
    updateElement,
    deleteElement } = require("../helper/factory");

const planRouter = express.Router();

const createPlan = createElement(planModel);
let getPlans = getElements(planModel);
let getPlan = getElement(planModel);
let updatePlan = updateElement(planModel);
let deletePlan = deleteElement(planModel);

planRouter.use(protectRoute);

planRouter
    .route('/')
    .post(bodyChecker, isAuthorised(["admin"]), createPlan)
    .get(protectRoute, isAuthorised(["admin", "ce"]), getPlans);

planRouter.route("/:id")
    .get(getPlan)
    .patch(bodyChecker, isAuthorised(["admin", "ce"]), updatePlan)
    .delete(bodyChecker, isAuthorised(["admin"]), deletePlan)

module.exports = planRouter;