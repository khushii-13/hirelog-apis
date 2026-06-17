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

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management APIs
 */

/**
 * @swagger
 * /api/private/job/create-job:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created
 */
jobRouter.post("/create-job", authMiddleware, roleMiddleware(["employer"]), createJob);

/**
 * @swagger
 * /api/private/job/get-jobs:
 *   post:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 */
jobRouter.post("/get-jobs", authMiddleware, getJobs);

/**
 * @swagger
 * /api/private/job/get-job:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 */
jobRouter.get("/get-job", authMiddleware, getJobById);

/**
 * @swagger
 * /api/private/job/update-job/{id}:
 *   put:
 *     summary: Update a job
 *     tags: [Jobs]
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
 *     responses:
 *       200:
 *         description: Job updated successfully
 */
jobRouter.put("/update-job/:id", authMiddleware, roleMiddleware(["employer"]), updateJob);

/**
 * @swagger
 * /api/private/job/delete-job/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
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
 *         description: Job deleted successfully
 */
jobRouter.delete("/delete-job/:id", authMiddleware, roleMiddleware(["employer"]), deleteJob);

/**
 * @swagger
 * /api/private/job/toggle/{id}:
 *   patch:
 *     summary: Toggle job status
 *     tags: [Jobs]
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
 *         description: Job toggled successfully
 */
jobRouter.patch("/toggle/:id", authMiddleware, roleMiddleware(["employer"]), toggleJob);

module.exports = jobRouter;
