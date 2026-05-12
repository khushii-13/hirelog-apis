const Application = require("../models/application");
const Job = require("../models/job");
const mongoose = require("mongoose");
const sendResponse = require("../utils/response");
const errorHandler = require("../utils/error");

const apply = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return sendResponse(res, 400, false, "Job ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return sendResponse(res, 400, false, "Invalid job ID");
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    if (job.isDeleted) {
      return sendResponse(res, 400, false, "This job is no longer available");
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return sendResponse(res, 400, false, "You have already applied for this job");
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
    });

    return sendResponse(res, 201, true, "Applied successfully", application);
  } catch (error) {
    return errorHandler(error, res);
  }
};

const getMyApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.body;

    let query = {
      applicant: req.user.id,
    };

    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const applications = await Application.find(query)
      .populate("job", "title companyName location jobType")
      .skip(skip)
      .limit(limitNum)
      .sort({ appliedAt: -1 });


    const totalCount = await Application.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    return sendResponse(res, 200, true, "Applications retrieved successfully", {
      applications,
      pagination: {
        currentPage: pageNum,
        pageSize: limitNum,
        totalItems: totalCount,
        totalPages: totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { page = 1, limit = 10, status } = req.body;


    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return sendResponse(res, 400, false, "Invalid job ID");
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    if (job.createdBy.toString() !== req.user.id) {
      return sendResponse(res, 403, false, "You cannot view applications for this job");
    }

    let query = {
      job: jobId,
    };

    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const applications = await Application.find(query)
      .populate("applicant", "name email")
      .skip(skip)
      .limit(limitNum)
      .sort({ appliedAt: -1 });

    const totalCount = await Application.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    return sendResponse(res, 200, true, "Job applications retrieved successfully", {
      applications,
      pagination: {
        currentPage: pageNum,
        pageSize: limitNum,
        totalItems: totalCount,
        totalPages: totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid application ID");
    }


    const application = await Application.findById(id).populate("job");

    if (!application) {
      return sendResponse(res, 404, false, "Application not found");
    }

    if (application.job.createdBy.toString() !== req.user.id) {
      return sendResponse(res, 403, false, "You cannot update this application");
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status: status },
      { new: true , runValidators : true},
    ).populate("applicant", "name email");

    return sendResponse(res, 200, true, "Application status updated successfully", updatedApplication);
  } catch (error) {
    return errorHandler(error, res);
  }
};

const deleteApplication = async (req, res) => {
  try {
    const id = req.params.id;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid application ID");
    }

    const application = await Application.findById(id);

    if (!application) {
      return sendResponse(res, 404, false, "Application not found");
    }

    if (application.applicant.toString() !== req.user.id) {
      return sendResponse(res, 403, false, "You cannot delete this application");
    }

    await Application.findByIdAndDelete(id);

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
