const Job = require("../models/job");
const mongoose = require("mongoose");

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
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    if (!Array.isArray(skillsRequired) || skillsRequired.length === 0) {
      return res.status(400).json({
        message: "skillsRequired must be a non-empty array",
      });
    }

    const normalizedSkills = skillsRequired.map((skill) =>
      skill.trim().toLowerCase(),
    );

    if (experience && (experience.min < 0 || experience.max < experience.min)) {
      return res.status(400).json({
        message: "Invalid experience range",
      });
    }

    const validTypes = ["Full-Time", "Part-Time", "Internship", "Contract"];
    if (!validTypes.includes(jobType)) {
      return res.status(400).json({
        message: "Invalid job type",
      });
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

    return res.status(201).json({
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
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
      limit = 10
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
      if (!mongoose.Types.ObjectId.isValid(createdBy)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }
      query.createdBy = new mongoose.Types.ObjectId(createdBy);
    }

    // 🔹 Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(query)
      .skip(skip)
      .limit(limitNum);

    const totalCount = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json({
      success: true,
      message: "Jobs retrieved successfully",
      data: jobs,
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
module.exports = { createJob, getJobs };
