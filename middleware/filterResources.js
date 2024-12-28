const Apartment = require("../resources/resources.model");

async function filterResources(req, res, next) {
    try {
        const filters = {};

        if (req.query.minPrice || req.query.maxPrice) {
            filters.price = {};
            if (req.query.minPrice) {
                filters.price.$gte = Number(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                filters.price.$lte = Number(req.query.maxPrice);
            }
        }
        if (req.query.maxPeople) {
            filters.maxPeople = { $gte: Number(req.query.maxPeople) };
        }
        if (req.query.numberOfRooms) {
            filters.numberOfRooms = Number(req.query.numberOfRooms);
        }
        if (req.query.location) {
            filters.location = req.query.location.trim();
        }
        if (req.query.wifi) {
            filters.wifi = req.query.wifi.toLowerCase() === "true";
        }
        if (req.query.parking) {
            filters.parking = req.query.parking.toLowerCase() === "true";
        }
        if (req.query.startDate || req.query.endDate) {
            filters.availabilityPeriods = {
                $elemMatch: {},
            };
            if (req.query.startDate) {
                filters.availabilityPeriods.$elemMatch.startDate = { $lte: new Date(req.query.startDate) };
            }
            if (req.query.endDate) {
                filters.availabilityPeriods.$elemMatch.endDate = { $gte: new Date(req.query.endDate) };
            }
        }

        req.filters = filters;

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to process filters" });
    }

};

module.exports = filterResources;