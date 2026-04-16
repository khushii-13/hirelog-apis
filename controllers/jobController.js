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
    const userId = req.query.id;
    


    let query = {
      isActive: true,
      isDeleted: false,
    };

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          message: "Invalid user ID format",
        });
      }
      query.createdBy = new mongoose.Types.ObjectId(userId);
    }

    const jobs = await Job.find(query);

    return res.status(200).json({
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
module.exports = { createJob, getJobs };
