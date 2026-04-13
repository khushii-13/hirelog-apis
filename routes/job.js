const express = require("express");
const jobRouter = express.Router();
const {createJob} = require("../controllers/jobController");

jobRouter.post("/create-jpb", createJob);
module.exports = jobRouter;