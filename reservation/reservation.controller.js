const Reservation = require("./reservation.model");
const Resources = require("../resources/resources.model");
const crypto = require("crypto");


async function createReservation(req, res) {
    try {
        const {
            apartmentId,
            customerName,
            customerEmail,
            customerPhone,
            startDate,
            endDate,
            specialMessage,
        } = req.body;


        const apartment = await Resources.findById(apartmentId);
        if (!apartment) {
            return res.status(404).send({ message: "Apartment not found!" });
        }

        let reservationCode;
        let isCodeUnique = false;

        while (!isCodeUnique) {
            reservationCode = crypto.randomBytes(4).toString("hex");


            const existingReservation = await Reservation.findOne({ reservationCode });
            if (!existingReservation) {
                isCodeUnique = true;
            }
        }
        const reservation = new Reservation({
            apartment: apartmentId,
            customerName,
            customerEmail,
            customerPhone,
            reservationCode,
            startDate,
            endDate,
            specialMessage,
        });


        await reservation.save();


        res.status(201).send({
            message: "Reservation created successfully!",
            reservationCode,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to create reservation" });
    }
}

const allReservations = async (_req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.status(200).send(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch reservations" });
    }
};

async function getReservation(req, res) {
    try {
        const reservationCode = req.params.code;
        const reservation = await Reservation.findOne({ reservationCode }).populate("apartment");
        if (!reservation) {
            return res.status(404).send({ message: "Reservation not found!" });
        }
        const apartment = await Resources.findById(reservation.apartment);
        if (!apartment) {
            return res.status(404).send({ message: "Associated apartment not found!" });
        }

        res.status(200).send({
            reservation,
            privateAdminInfo: apartment.privateAdminInfo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch reservation" });
    }
}

async function updateReservation(req, res) {
    try {
        const reservationCode = req.params.code;
        const updateData = { ...req.body };

        const updatedReservation = await Reservation.findOneAndUpdate(
            { reservationCode },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedReservation) {
            return res.status(404).send({ message: "Reservation not found" });
        }

        res.status(200).send({ message: "Reservation updated successfully", updatedReservation });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update reservation", error: error.message });
    }
}

async function deleteReservation(req, res) {
    try {
        const deletedReservation = await Reservation.findOneAndDelete(req.params.code);
        if (!deletedReservation) {
            return res.status(404).send({ message: "Reservation is not Found!" });
        }
        res.status(200).send({ message: "Reservation deleted successfully", resource: deletedReservation, });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete a reservation" });
    }
};


module.exports = {
    createReservation,
    allReservations,
    getReservation,
    updateReservation,
    deleteReservation
};