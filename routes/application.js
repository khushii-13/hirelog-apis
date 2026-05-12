const express = require("express");
const applicationRouter = express.Router();
const {
  apply,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

applicationRouter.post("/apply", authMiddleware, roleMiddleware(["job_seeker"]), apply);
applicationRouter.post(
  "/get-my-applications",
  authMiddleware,
  roleMiddleware(["job_seeker"]),
  getMyApplications,
);
applicationRouter.get(
  "/get-job-applications/:jobId",
  authMiddleware,
  roleMiddleware(["employer"]),
  getJobApplications,
);
applicationRouter.patch(
  "/status/:id",
  authMiddleware,
  roleMiddleware(["employer"]),
  updateApplicationStatus,
);
applicationRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["job_seeker"]),
  deleteApplication,
);

module.exports = applicationRouter;
