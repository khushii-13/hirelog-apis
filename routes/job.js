const express = require("express");
const jobRouter = express.Router();
const {createJob} = require("../controllers/jobController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

jobRouter.post("/create-job",authMiddleware, roleMiddleware(['employer']), createJob);
module.exports = jobRouter;