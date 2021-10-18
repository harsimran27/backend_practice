const mongoose = require("mongoose");
const { db_link } = require("../secret");

mongoose.connect(db_link).then(function () {
    console.log("database is connected");
}).catch(function (err) {
    console.log(err);
})

const reviewSchema = new mongoose.Schema({

    review: {
        type: String,
        required: [true, "Review can't be empty"]
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "you must have to give rating"]
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },

    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must be belong to user"],
        ref: "userModel"
    },

    plan: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must be belong to plan"],
        ref: "planModel"
    }


})

const reviewModel = mongoose.model("reviewModel", reviewSchema);
module.exports = reviewModel;