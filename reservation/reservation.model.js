const mongoose = require("mongoose");
const Resources = require("../resources/resources.model");

const reservationSchema = new mongoose.Schema(
    {
        apartment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resources",
            required: true,
        },
        customerName: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true,
        },
        customerEmail: {
            type: String,
            required: [true, "Customer email is required"],
            match: [/.+@.+\..+/, "Please provide a valid email address"],
        },
        customerPhone: {
            type: String,
            required: [true, "Customer phone number is required"],
            match: [/^\+?\d{9,15}$/, "Please provide a valid phone number"],
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
        },
        specialMessage: {
            type: String,
            trim: true,
            default: "",
        },
        reservationCode: {
            type: String,
            unique: true,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;