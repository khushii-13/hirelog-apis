const jobService = require("../services/jobService");
const sendResponse = require("../utils/response");
const errorHandler = require("../utils/error");

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      companyName,
      location,
      jobType,
      experience,
      salary,
      skillsRequired,
      openings,
      applicationDeadline,
    } = req.body;

    if (
      !title ||
      !description ||
      !companyName ||
      !location ||
      !jobType ||
      !skillsRequired ||
      !applicationDeadline
    ) {
      return sendResponse(res, 400, false, "Required fields are missing");
    }

    if (!Array.isArray(skillsRequired) || skillsRequired.length === 0) {
      return sendResponse(res, 400, false, "skillsRequired must be a non-empty array");
    }

    if (experience && (experience.min < 0 || experience.max < experience.min)) {
      return sendResponse(res, 400, false, "Invalid experience range");
    }

    const validTypes = ["Full-Time", "Part-Time", "Internship", "Contract"];
    if (!validTypes.includes(jobType)) {
      return sendResponse(res, 400, false, "Invalid job type");
    }

    const job = await jobService.createJob(req.body, req.user.id);
    return sendResponse(res, 201, true, "Job created successfully", job);
  } catch (error) {
    return errorHandler(error, res);
  }
};

const getJobs = async (req, res) => {
  try {
    const result = await jobService.getJobs(req.body);
    return sendResponse(res, 200, true, "Jobs retrieved successfully", result);
  } catch (error) {
    return errorHandler(error, res);
  }
};

const getJobById = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return sendResponse(res, 400, false, "Invalid Id!!");
    }

    const job = await jobService.getJobById(id);
    return sendResponse(res, 200, true, "Job fetched successfully", job);
  } catch (error) {
    return errorHandler(error, res);
  }
};

const updateJob = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return sendResponse(res, 400, false, "Job ID is required");
    }

    const { skillsRequired } = req.body;
    if (skillsRequired && Array.isArray(skillsRequired) && skillsRequired.length === 0) {
      return sendResponse(res, 400, false, "skillsRequired must be a non-empty array");
    }

    const updatedJob = await jobService.updateJob(id, req.body, req.user.id);
    return sendResponse(res, 200, true, "Job updated successfully", updatedJob);
  } catch (error) {
    return errorHandler(error, res);
  }
};

const deleteJob = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return sendResponse(res, 400, false, "Job ID is required");
    }

    await jobService.deleteJob(id, req.user.id);
    return sendResponse(res, 200, true, "Job deleted successfully");
  } catch (error) {
    return errorHandler(error, res);
  }
};

const toggleJob = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return sendResponse(res, 400, false, "Job ID is required");
    }

    const updatedJob = await jobService.toggleJob(id, req.user.id);
    return sendResponse(
      res,
      200,
      true,
      updatedJob.isActive ? "Job activated" : "Job deactivated",
      updatedJob,
    );
  } catch (error) {
    return errorHandler(error, res);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleJob,
};
