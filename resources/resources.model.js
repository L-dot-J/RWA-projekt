const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be less than 0'],
        },
        maxPeople: {
            type: Number,
            required: [true, 'Maximum number of people is required'],
            min: [1, 'Maximum number of people must be at least 1'],
        },
        numberOfRooms: {
            type: Number,
            required: [true, 'Number of rooms is required'],
            min: [1, 'Number of rooms must be at least 1'],
        },
        parking: {
            type: Boolean,
            default: false,
        },
        wifi: {
            type: Boolean,
            default: false,
        },
        availabilityPeriods: {
            type: [{
                startDate: { type: Date, required: true },
                endDate: { type: Date, required: true },
            }],
            required: [true, 'Availability periods are required'],
        },
        privateAdminInfo: {
            adminPhone: { type: String, required: true },
            realAddress: { type: String, required: true },
        },

    },
    {
        timestamps: true,
    }
);


const Resources = mongoose.model('Resources', apartmentSchema);
module.exports = Resources;