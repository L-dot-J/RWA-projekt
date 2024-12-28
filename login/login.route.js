const express = require("express");
const router = express.Router();

const { login, refreshToken, logout } = require('./login.controller');

router
    .route("/")
    .post(login)
    .all((_req, res) => {
        res.set({ Allow: "POST" });
        res.status(405).send();
    });
router
    .route("/refresh")
    .post(refreshToken)
    .all((_req, res) => {
        res.set({ Allow: "POST" });
        res.status(405).send();
    });
router
    .route("/logout")
    .post(logout)
    .all((_req, res) => {
        res.set({ Allow: "POST" });
        res.status(405).send();
    });
module.exports = router; 