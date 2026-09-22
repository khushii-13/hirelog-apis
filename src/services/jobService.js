const Job = require("../models/job");
const mongoose = require("mongoose");

const createJob = async (jobData, userId) => {
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
  } = jobData;

  const normalizedSkills = skillsRequired.map((skill) =>
    skill.trim().toLowerCase(),
  );

  const job = await Job.create({
    title,
    description,
    companyName,
    location,
    jobType,
    experience,
    salary,
    skillsRequired: normalizedSkills,
    openings,
    applicationDeadline,
    createdBy: userId,
  });

  return job;
};

const getJobs = async (filterParams) => {
  const {
    title,
    companyName,
    location,
    jobType,
    skillsRequired,
    createdBy,
    page = 1,
    limit = 10,
  } = filterParams;

  let query = {
    isActive: true,
    isDeleted: false,
  };

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (companyName) {
    query.companyName = { $regex: companyName, $options: "i" };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    query.jobType = jobType;
  }

  if (skillsRequired && skillsRequired.length > 0) {
    query.skillsRequired = { $in: skillsRequired };
  }

  if (createdBy) {
    query.createdBy = createdBy;
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const jobs = await Job.find(query)
    .sort({ createdBy: -1 })
    .skip(skip)
    .limit(limitNum);

  const totalCount = await Job.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limitNum);

  return {
    jobs,
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

const getJobById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid Id!!");
    error.statusCode = 400;
    throw error;
  }

  const job = await Job.findById(id);
  if (!job || job.isDeleted) {
    const error = new Error("Job not found!!");
    error.statusCode = 400;
    throw error;
  }

  return job;
};

const updateJob = async (id, updateData, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid job ID");
    error.statusCode = 400;
    throw error;
  }

  const job = await Job.findById(id);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  if (job.createdBy.toString() !== userId) {
    const error = new Error("You cannot update this job");
    error.statusCode = 403;
    throw error;
  }

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
  } = updateData;

  const normalizedSkills = skillsRequired
    ? skillsRequired.map((skill) => skill.trim().toLowerCase())
    : job.skillsRequired;

  const updatedJob = await Job.findByIdAndUpdate(
    id,
    {
      title: title || job.title,
      description: description || job.description,
      companyName: companyName || job.companyName,
      location: location || job.location,
      jobType: jobType || job.jobType,
      experience: {
        min: experience?.min ?? job.experience?.min,
        max: experience?.max ?? job.experience?.max,
      },
      salary: {
        min: salary?.min ?? job.salary?.min,
        max: salary?.max ?? job.salary?.max,
      },
      skillsRequired: normalizedSkills,
      openings: openings ?? job.openings,
      applicationDeadline: applicationDeadline || job.applicationDeadline,
    },
    { new: true },
  );

  return updatedJob;
};

const deleteJob = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid job ID");
    error.statusCode = 400;
    throw error;
  }

  const job = await Job.findById(id);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  if (job.createdBy.toString() !== userId) {
    const error = new Error("You cannot delete this job");
    error.statusCode = 403;
    throw error;
  }

  await Job.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return true;
};

const toggleJob = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid job ID");
    error.statusCode = 400;
    throw error;
  }

  const job = await Job.findById(id);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  if (job.createdBy.toString() !== userId) {
    const error = new Error("You cannot toggle this job");
    error.statusCode = 403;
    throw error;
  }

  const updatedJob = await Job.findByIdAndUpdate(
    id,
    { isActive: !job.isActive },
    { new: true },
  );

  return updatedJob;
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleJob,
};
