const Job = require("../models/job");
const Application = require("../models/application");

const getDashboardData = async (userId, userRole) => {
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

    return {
      role: "employer",
      totalJobs,
      activeJobs,
      inactiveJobs,
      totalApplications,
      shortlistedApplications,
      rejectedApplications,
    };
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

    return {
      role: "job_seeker",
      totalApplications,
      appliedApplications,
      shortlistedApplications,
      rejectedApplications,
    };
  }
};

module.exports = {
  getDashboardData,
};
