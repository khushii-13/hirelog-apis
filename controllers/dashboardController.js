const Job = require("../models/job");
const Application = require("../models/application");
const sendResponse = require("../utils/response");
const errorHandler = require("../utils/error");

const dashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === "employer") {
      const jobs = await Job.find({
        createdBy: userId,
        isDeleted: false,
      });

      const jobIds = jobs.map((job) => job._id);

      const totalJobs = jobs.length;
      const activeJobs = jobs.filter((job) => job.isActive).length;
      const inactiveJobs = jobs.filter((job) => !job.isActive).length;

      const totalApplications = await Application.countDocuments({
        job: { $in: jobIds },
      });

      const shortlistedApplications = await Application.countDocuments({
        job: { $in: jobIds },
        status: "shortlisted",
      });

      const rejectedApplications = await Application.countDocuments({
        job: { $in: jobIds },
        status: "rejected",
      });

      return sendResponse(res, 200, true, "Dashboard data retrieved successfully", {
        role: "employer",
        totalJobs: totalJobs,
        activeJobs: activeJobs,
        inactiveJobs: inactiveJobs,
        totalApplications: totalApplications,
        shortlistedApplications: shortlistedApplications,
        rejectedApplications: rejectedApplications,
      });
    } else {
      const totalApplications = await Application.countDocuments({
        applicant: userId,
      });

      const appliedApplications = await Application.countDocuments({
        applicant: userId,
        status: "applied",
      });

      const shortlistedApplications = await Application.countDocuments({
        applicant: userId,
        status: "shortlisted",
      });

      const rejectedApplications = await Application.countDocuments({
        applicant: userId,
        status: "rejected",
      });

      return sendResponse(res, 200, true, "Dashboard data retrieved successfully", {
        role: "job_seeker",
        totalApplications: totalApplications,
        appliedApplications: appliedApplications,
        shortlistedApplications: shortlistedApplications,
        rejectedApplications: rejectedApplications,
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

module.exports = { dashboard };
