const Application = require("../models/application");
const Job = require("../models/job");
const mongoose = require("mongoose");

const applyForJob = async (jobId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    const error = new Error("Invalid job ID");
    error.statusCode = 400;
    throw error;
  }

  const job = await Job.findById(jobId);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  if (job.isDeleted) {
    const error = new Error("This job is no longer available");
    error.statusCode = 400;
    throw error;
  }

  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId,
  });

  if (existingApplication) {
    const error = new Error("You have already applied for this job");
    error.statusCode = 400;
    throw error;
  }

  const application = await Application.create({
    job: jobId,
    applicant: userId,
  });

  return application;
};

const getMyApplications = async (userId, options = {}) => {
  const { page = 1, limit = 10, status } = options;

  let query = {
    applicant: userId,
  };

  if (status) {
    query.status = status;
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const applications = await Application.find(query)
    .populate("job", "title companyName location jobType")
    .skip(skip)
    .limit(limitNum)
    .sort({ appliedAt: -1 });

  const totalCount = await Application.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limitNum);

  return {
    applications,
    pagination: {
      currentPage: pageNum,
      pageSize: limitNum,
      totalItems: totalCount,
      totalPages: totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

const getJobApplications = async (jobId, userId, options = {}) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    const error = new Error("Invalid job ID");
    error.statusCode = 400;
    throw error;
  }

  const job = await Job.findById(jobId);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  if (job.createdBy.toString() !== userId) {
    const error = new Error("You cannot view applications for this job");
    error.statusCode = 403;
    throw error;
  }

  const { page = 1, limit = 10, status } = options;

  let query = {
    job: jobId,
  };

  if (status) {
    query.status = status;
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const applications = await Application.find(query)
    .populate("applicant", "name email")
    .skip(skip)
    .limit(limitNum)
    .sort({ appliedAt: -1 });

  const totalCount = await Application.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limitNum);

  return {
    applications,
    pagination: {
      currentPage: pageNum,
      pageSize: limitNum,
      totalItems: totalCount,
      totalPages: totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

const updateApplicationStatus = async (id, status, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid application ID");
    error.statusCode = 400;
    throw error;
  }

  const application = await Application.findById(id).populate("job");
  if (!application) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  if (application.job.createdBy.toString() !== userId) {
    const error = new Error("You cannot update this application");
    error.statusCode = 403;
    throw error;
  }

  const updatedApplication = await Application.findByIdAndUpdate(
    id,
    { status: status },
    { new: true, runValidators: true },
  ).populate("applicant", "name email");

  return updatedApplication;
};

const deleteApplication = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid application ID");
    error.statusCode = 400;
    throw error;
  }

  const application = await Application.findById(id);
  if (!application) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  if (application.applicant.toString() !== userId) {
    const error = new Error("You cannot delete this application");
    error.statusCode = 403;
    throw error;
  }

  await Application.findByIdAndDelete(id);
  return true;
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
};
