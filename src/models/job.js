const pool = require("../config/db");

const Job = {
  // Create a new job
  create: async (jobData) => {
    const query = `
      INSERT INTO jobs (
        title, description, company_name, location, job_type, 
        experience_min, experience_max, salary_min, salary_max, 
        skills_required, openings, application_deadline, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      jobData.title,
      jobData.description,
      jobData.companyName,
      jobData.location,
      jobData.jobType,
      jobData.experienceMin || null,
      jobData.experienceMax || null,
      jobData.salaryMin || 0,
      jobData.salaryMax || 0,
      JSON.stringify(jobData.skillsRequired || []),
      jobData.openings || 1,
      jobData.applicationDeadline || null,
      jobData.createdBy
    ];

    const [result] = await pool.query(query, values);
    return result;
  },

  // Get all active jobs
  findAll: async () => {
    const query = "SELECT * FROM jobs WHERE is_deleted = FALSE";
    const [rows] = await pool.query(query);
    return rows;
  },

  // Get a job by ID
  findById: async (id) => {
    const query = "SELECT * FROM jobs WHERE id = ? AND is_deleted = FALSE";
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  // Soft delete a job
  deleteById: async (id) => {
    const query = "UPDATE jobs SET is_deleted = TRUE WHERE id = ?";
    const [result] = await pool.query(query, [id]);
    return result;
  }
};

module.exports = Job;
