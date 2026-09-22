const applicationService = require("../services/applicationService");
const sendResponse = require("../utils/response");
const errorHandler = require("../utils/error");

const apply = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return sendResponse(res, 400, false, "Job ID is required");
    }

    const application = await applicationService.applyForJob(jobId, req.user.id);
    return sendResponse(res, 201, true, "Applied successfully", application);
  } catch (error) {
    return errorHandler(error, res);
  }
};

const getMyApplications = async (req, res) => {
  try {
    const result = await applicationService.getMyApplications(
      req.user.id,
      req.body || {},
    );
    return sendResponse(
      res,
      200,
      true,
      "Applications retrieved successfully",
      result,
    );
  } catch (error) {
    return errorHandler(error, res);
  }
};

const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const options = req.body || req.query || {};

    const result = await applicationService.getJobApplications(
      jobId,
      req.user.id,
      options,
    );
    return sendResponse(
      res,
      200,
      true,
      "Job applications retrieved successfully",
      result,
    );
  } catch (error) {
    return errorHandler(error, res);
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
      return sendResponse(res, 400, false, "Status is required");
    }

    const updatedApplication = await applicationService.updateApplicationStatus(
      id,
      status,
      req.user.id,
    );
    return sendResponse(
      res,
      200,
      true,
      "Application status updated successfully",
      updatedApplication,
    );
  } catch (error) {
    return errorHandler(error, res);
  }
};

const deleteApplication = async (req, res) => {
  try {
    const id = req.params.id;
    await applicationService.deleteApplication(id, req.user.id);
    return sendResponse(res, 200, true, "Application withdrawn successfully");
  } catch (error) {
    return errorHandler(error, res);
  }
};

module.exports = {
  apply,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
};
