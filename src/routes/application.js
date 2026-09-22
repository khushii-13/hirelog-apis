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

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job Application APIs
 */

/**
 * @swagger
 * /api/private/applications/apply:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *               resume:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 */
applicationRouter.post("/apply", authMiddleware, roleMiddleware(["job_seeker"]), apply);

/**
 * @swagger
 * /api/private/applications/get-my-applications:
 *   post:
 *     summary: Get all applications for the logged in user
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 */
applicationRouter.post(
  "/get-my-applications",
  authMiddleware,
  roleMiddleware(["job_seeker"]),
  getMyApplications,
);

/**
 * @swagger
 * /api/private/applications/get-job-applications/{jobId}:
 *   get:
 *     summary: Get all applications for a specific job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 */
applicationRouter.get(
  "/get-job-applications/:jobId",
  authMiddleware,
  roleMiddleware(["employer"]),
  getJobApplications,
);

/**
 * @swagger
 * /api/private/applications/status/{id}:
 *   patch:
 *     summary: Update application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application status updated
 */
applicationRouter.patch(
  "/status/:id",
  authMiddleware,
  roleMiddleware(["employer"]),
  updateApplicationStatus,
);

/**
 * @swagger
 * /api/private/applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application deleted successfully
 */
applicationRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["job_seeker"]),
  deleteApplication,
);

module.exports = applicationRouter;
