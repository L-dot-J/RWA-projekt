const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const filterResources = require("../middleware/filterResources");
const router = express.Router();
const { getAllResources, createResource, getSingleResource, updateResource, deleteResource } = require("./resources.controller");

router
    .route("/")
    .get(filterResources, getAllResources)
    .post(verifyToken, createResource)
    .all((_req, res) => {
        res.set({ Allow: "POST, GET" });
        res.status(405).send();
    });

router
    .route("/:id")
    .get(getSingleResource)
    .patch(verifyToken, updateResource)
    .delete(verifyToken, deleteResource)
    .all((_req, res) => {
        res.set({ Allow: "GET, PATCH, DELETE" });
        res.status(405).send();
    });


module.exports = router;