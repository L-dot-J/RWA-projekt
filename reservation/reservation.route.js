const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { createReservation, allReservations, getReservation, updateReservation, deleteReservation } = require("./reservation.controller");

router
    .route("/")
    .post(createReservation)
    .get(verifyToken, allReservations)
    .all((_req, res) => {
        res.set({ Allow: "POST, GET" });
        res.status(405).send();
    });

router
    .route("/:code")
    .get(getReservation)
    .patch(verifyToken, updateReservation)
    .delete(verifyToken, deleteReservation)
    .all((_req, res) => {
        res.set({ Allow: "GET, PATCH, DELETE" });
        res.status(405).send();
    });

module.exports = router;