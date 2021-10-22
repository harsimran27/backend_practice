const express = require("express");
const bookingModel = require("../model/bookingModel");
const { bodyChecker, protectRoute, isAuthorised } = require("./utilFunc");

const {
    getElement, getElements,
    updateElement } = require("../helper/factory");

const bookingRouter = express.Router();

let getBookings = getElements(bookingModel);
let getBooking = getElement(bookingModel);
let updateBooking = updateElement(bookingModel);

bookingRouter.use(protectRoute);

bookingRouter
    .route("/getUserAlso")
    .get(getUserAlso)

bookingRouter
    .route('/')
    .post(bodyChecker, isAuthorised(["admin"]), createBooking)
    .get(protectRoute, isAuthorised(["admin", "ce"]), getBookings);

bookingRouter.route("/:id")
    .get(getBooking)
    .patch(bodyChecker, isAuthorised(["admin", "ce"]), updateBooking)
    .delete(bodyChecker, isAuthorised(["admin"]), deleteBooking)

module.exports = bookingRouter;