const mongoose = require("mongoose");
const { db_link } = require("../secret");
// const validator = require("email-validator");

mongoose.connect(db_link).then(function () {
    console.log("database is connected");
}).catch(function (err) {
    console.log(err);
})

const planSchema = new mongoose.Schema({

    name: {
        type: String,
        unique: [true, "You have to enter unique Plan name"],
        required: [true, "You are required to enter the plan name"],
        minLength: [4, "Your plan name Length must be larger than or equal to 4"],
    },

    duration: {
        type: Number,
        required: [true, "You need to provide duration"]
    },

    price: {
        type: Number,
        required: [true, "You need to provide price of the plan"]
    },

    discount: {
        type: Number,
        validate: function () {
            return this.discount < this.price;
        },
        message: ["Your discount must be less than the actual price"]
    },

    planImage: {
        type: [String]
    },

    averageRating: Number,

    reviews: {
        type: [mongoose.Schema.ObjectId],
    }

})

const planModel = mongoose.model("planModel", planSchema);
module.exports = planModel;