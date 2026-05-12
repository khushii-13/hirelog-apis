const Job = require("../models/job");
const mongoose = require("mongoose");
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

    const normalizedSkills = skillsRequired.map((skill) =>
      skill.trim().toLowerCase(),
    );

    if (experience && (experience.min < 0 || experience.max < experience.min)) {
      return sendResponse(res, 400, false, "Invalid experience range");
    }

    const validTypes = ["Full-Time", "Part-Time", "Internship", "Contract"];
    if (!validTypes.includes(jobType)) {
      return sendResponse(res, 400, false, "Invalid job type");
    }

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
      createdBy: req.user.id,
    });

    return sendResponse(res, 201, true, "Job created successfully", job);
  } catch (error) {
    return errorHandler(error, res);
  }
};

const getJobs = async (req, res) => {
  try {
    const {
      title,
      companyName,
      location,
      jobType,
      experience,
      salary,
      skillsRequired,
      createdBy,
      page = 1,
      limit = 10,
    } = req.body;

    let query = {
      isActive: true,
      isDeleted: false,
    };

    // 🔹 Text filters
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

    // if (experience) {
    //   query.$and = query.$and || [];

    //   if (experience.min !== undefined) {
    //     query.$and.push({
    //       "experience.max": { $gte: experience.min }
    //     });
    //   }

    //   if (experience.max !== undefined) {
    //     query.$and.push({
    //       "experience.min": { $lte: experience.max }
    //     });
    //   }
    // }

    // if (salary) {
    //   query.$and = query.$and || [];

    //   if (salary.min !== undefined) {
    //     query.$and.push({
    //       "salary.max": { $gte: salary.min }
    //     });
    //   }

    //   if (salary.max !== undefined) {
    //     query.$and.push({
    //       "salary.min": { $lte: salary.max }
    //     });
    //   }
    // }

    // 🔹 Skills
    if (skillsRequired && skillsRequired.length > 0) {
      query.skillsRequired = { $in: skillsRequired };
    }

    // 🔹 createdBy
    if (createdBy) {
      query.createdBy = createdBy;
    }

    // 🔹 Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(query).sort({createdBy : -1}).skip(skip).limit(limitNum);

    const totalCount = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    return sendResponse(res, 200, true, "Jobs retrieved successfully", {
      jobs,
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

const getJobById = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return sendResponse(res, 400, false, "Invalid Id!!");
    }


    const job = await Job.findById(id);
    if(job.isDeleted){
    return sendResponse(res, 400, false, "Job not found!!");
    }
    return sendResponse(res, 200, true, "Job fetched successfully", job);
  } catch (error) {
    return errorHandler(error, res);
  }
};

const updateJob = async (req, res) => {
  try {
    const id = req.params.id;
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

    if (!id) {
      return sendResponse(res, 400, false, "Job ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid job ID");
    }

    const job = await Job.findById(id);

    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    if (job.createdBy.toString() !== req.user.id) {
      return sendResponse(res, 403, false, "You cannot update this job");
    }

    if (skillsRequired && Array.isArray(skillsRequired)) {
      if (skillsRequired.length === 0) {
        return sendResponse(res, 400, false, "skillsRequired must be a non-empty array");
      }
    }

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
          min: experience?.min ?? job.experience.min,
          max: experience?.max ?? job.experience.max,
        },
        salary: {
          min: salary?.min ?? job.salary.min,
          max: salary?.max ?? job.salary.max,
        },
        skillsRequired: normalizedSkills,
        openings: openings ?? job.openings,
        applicationDeadline: applicationDeadline || job.applicationDeadline,
      },
      { new: true },
    );

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid job ID");
    }

    const job = await Job.findById(id);

    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    if (job.createdBy.toString() !== req.user.id) {
      return sendResponse(res, 403, false, "You cannot delete this job");
    }

    await Job.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid job ID");
    }

    const job = await Job.findById(id);

    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    if (job.createdBy.toString() !== req.user.id) {
      return sendResponse(res, 403, false, "You cannot toggle this job");
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { isActive: !job.isActive },
      { new: true },
    );

    return sendResponse(res, 200, true, updatedJob.isActive ? "Job activated" : "Job deactivated", updatedJob);
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
