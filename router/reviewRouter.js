const express = require("express");
const reviewModel = require("../model/reviewModel");
const { bodyChecker, protectRoute, isAuthorised } = require("./utilFunc");

const {
    getElement, getElements,
    updateElement } = require("../helper/factory");

const reviewRouter = express.Router();

let getReviews = getElements(reviewModel);
let getReview = getElement(reviewModel);
let updateReview = updateElement(reviewModel);

reviewRouter.use(protectRoute);

async function createReview(req, res) {
    try {

        let review = await reviewModel.create(req.body);

        let planId = review.plan;
        let plan = await planModel.findById(planId);
        plan.reviews.push(review["_id"]);

        if (plan.averageRating) {
            let sum = plan.averageRating * plan.reviews.length;
            let finalAvgRating = (sum + review.rating) / (plan.reviews.length + 1);
            plan.averageRating = finalAvgRating;
        } else {
            averageRating = review.rating;
        }

        await plan.save();

        res.status(200).json({
            message: "review created",
            review: review,
        })

    } catch (err) {
        res.status(500)
            .json({
                err: err.message,
            })
    }
}

async function deleteReview(req, res) {
    try {

        let review = await reviewModel.findByIdAndDelete(req.body.id);
        let planId = review.plan;
        let plan = await planModel.findById(planId);

        let indexOfReview = plan.reviews.indexOf(reviews["_id"]);
        plan.reviews.splice(indexOfReview, 1);

        await plan.save();

        res.status(200).json({
            message: "review successfully deleted",
            review: review,
        })

    } catch (err) {
        res.status(200)
            .json({
                err: err.message,
            })
    }
}

async function getUserAlso(req, res) {

    try {
        let reviews = await reviewModel.find().populate({
            path: "user plan",
            select: "name email duration price name"
        })

        res.status(200).json({
            review: reviews,
        })

    }
    catch (err) {
        res.status(500)
            .json({
                err: err.message,
            })
    }
}

reviewRouter
    .route("/getUserAlso")
    .get(getUserAlso)

reviewRouter
    .route('/')
    .post(bodyChecker, isAuthorised(["admin"]), createReview)
    .get(protectRoute, isAuthorised(["admin", "ce"]), getReviews);

reviewRouter.route("/:id")
    .get(getReview)
    .patch(bodyChecker, isAuthorised(["admin", "ce"]), updateReview)
    .delete(bodyChecker, isAuthorised(["admin"]), deleteReview)

module.exports = reviewRouter;