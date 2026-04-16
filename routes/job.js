const express = require("express");
const jobRouter = express.Router();
const {createJob, getJobs} = require("../controllers/jobController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

jobRouter.post("/create-job",authMiddleware, roleMiddleware(['employer']), createJob);
jobRouter.get("/get-jobs", authMiddleware, getJobs);
module.exports = jobRouter;