const Resources = require("./resources.model");

async function createResource(req, res) {
    try {
        const resource = { ...req.body };
        const newResource = await Resources(resource).save();
        res
            .status(200)
            .send({ message: "Resource posted successfully", resource: newResource });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to create resource" });
    }
};
async function getAllResources(req, res) {
    try {
        const filters = req.filters || {};
        console.log(filters);
        const resources = await Resources.find(filters).sort({ createdAt: -1 });
        res.status(200).send(resources);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch resources" });
    }
};
async function getSingleResource(req, res) {
    try {
        const singleResource = await Resources.findById(req.params.id);

        if (!singleResource) {
            return res.status(404).send({ message: "Resouurce not found!" });
        }
        res.status(200).send(singleResource);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch resource" });
    }
};
async function updateResource(req, res) {
    try {
        const updatedResource = await Resources.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
        if (!updatedResource) {
            return res.status(404).send({ message: "Resource not found!" });
        }
        res.status(200).send(updatedResource);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update a resource" });
    }
};
async function deleteResource(req, res) {
    try {
        const deletedResource = await Resources.findByIdAndDelete(req.params.id);
        if (!deletedResource) {
            return res.status(404).send({ message: "Resource is not Found!" });
        }
        res.status(200).send({ message: "Resource deleted successfully", resource: deletedResource, });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete a resource" });
    }
};

module.exports = {
    getAllResources,
    createResource,
    getSingleResource,
    updateResource,
    deleteResource,
};