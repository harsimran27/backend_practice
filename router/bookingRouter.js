const express = require("express");
const bookingModel = require("../model/bookingModel");
const userModel = require("../model/userModal");
const { bodyChecker, protectRoute, isAuthorised } = require("./utilFunc");
const Razorpay = require("razorpay");
let { KEY_ID, KEY_SECRET } = process.env
let razorpay = new Razorpay({
    KEY_ID,
    KEY_SECRET,
});

const {
    getElement, getElements,
    updateElement } = require("../helper/factory");

const bookingRouter = express.Router();

let getBookings = getElements(bookingModel);
let getBooking = getElement(bookingModel);
let updateBooking = updateElement(bookingModel);

bookingRouter.use(protectRoute);

const initiateBooking = async function (req, res) {
    try {
        let booking = await bookingModel.create(req.body);
        let bookingId = booking["_id"];
        let userId = req.body.user;
        let user = await userModel.findById(userId);
        user.bookings.push(bookingId);
        await user.save();
        const payment_capture = 1;
        const amount = 500;
        const currency = "INR";
        const options = {
            amount,
            currency,
            receipt: `rs_${bookingId}`,
            payment_capture,
        };
        const response = await razorpay.orders.create(options);
        console.log(response);
        res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            booking: booking,
            message: "booking created",
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

async function deleteBooking(req, res) {
    try {

        let booking = await bookingModel.findByIdAndDelete(req.body.id);
        let userId = booking.user;
        let user = await userModel.findById(userId);

        let indexOfBooking = user.bookings.indexOf(booking["_id"]);
        user.bookings.splice(indexOfBooking, 1);

        await user.save();

        res.status(200).json({
            message: "booking deleted successfully",
            booking: booking,
        })

    } catch (err) {
        res.status(200)
            .json({
                err: err.message,
            })
    }
}


bookingRouter
    .route('/')
    .post(bodyChecker, isAuthorised(["admin"]), initiateBooking)
    .get(protectRoute, isAuthorised(["admin", "ce"]), getBookings);

bookingRouter.route("/:id")
    .get(getBooking)
    .patch(bodyChecker, isAuthorised(["admin", "ce"]), updateBooking)
    .delete(bodyChecker, isAuthorised(["admin"]), deleteBooking)

module.exports = bookingRouter;