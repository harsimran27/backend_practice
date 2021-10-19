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

async function getBestPlans(req,res){
    try{
        let bestPlans = await planModel.find().sort("averageRating").populate({
            path:reviews,
            select:review,
        }) 

        res.status(200)
        .json({
            bestPlans:bestPlans,
        })

    }catch(err){
        res.status(500)
        .json({
            err:err.message,
        })
    }
}

planRouter.use(protectRoute);

planRouter
    .route("/sortByRating")
    .get(getBestPlans)

planRouter
    .route('/')
    .post(bodyChecker, isAuthorised(["admin"]), createPlan)
    .get(protectRoute, isAuthorised(["admin", "ce"]), getPlans);

planRouter.route("/:id")
    .get(getPlan)
    .patch(bodyChecker, isAuthorised(["admin", "ce"]), updatePlan)
    .delete(bodyChecker, isAuthorised(["admin"]), deletePlan)

module.exports = planRouter;