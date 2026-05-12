const express = require("express");
const jobRouter = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleJob,
} = require("../controllers/jobController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

jobRouter.post("/create-job", authMiddleware, roleMiddleware(["employer"]), createJob);
jobRouter.post("/get-jobs", authMiddleware, getJobs);
jobRouter.get("/get-job", authMiddleware, getJobById);
jobRouter.put("/update-job/:id", authMiddleware, roleMiddleware(["employer"]), updateJob);
jobRouter.delete("/delete-job/:id", authMiddleware, roleMiddleware(["employer"]), deleteJob);
jobRouter.patch("/toggle/:id", authMiddleware, roleMiddleware(["employer"]), toggleJob);
module.exports = jobRouter;