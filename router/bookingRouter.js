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

module.exports = bookingRouter;