const mongoose = require("mongoose");
const { db_link } = require("../secret");

mongoose.connect(db_link).then(function () {
    console.log("database is connected");
}).catch(function (err) {
    console.log(err);
})

const bookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },

    plan: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },

    bookedAt:{
        type:Date,
    },

    priceAtThatTime:{
        type:Number,
        required:true,
    },

    status:{
        type:String,
        enum:["pending", "failure", "success"],
        default:"pending",
        required:true,
    }

})

const bookingModel = mongoose.model("bookingModel", bookingSchema);
module.exports = bookingModel;