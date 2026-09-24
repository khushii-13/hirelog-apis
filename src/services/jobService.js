const pool = require("../config/db");

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

  const normalizedSkills = (skillsRequired || []).map((skill) => skill.trim().toLowerCase());

  const query = `
    INSERT INTO jobs (
      title, description, company_name, location, job_type, 
      experience_min, experience_max, salary_min, salary_max, 
      skills_required, openings, application_deadline, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    title,
    description,
    companyName,
    location,
    jobType,
    experience?.min || null,
    experience?.max || null,
    salary?.min || 0,
    salary?.max || 0,
    JSON.stringify(normalizedSkills),
    openings || 1,
    applicationDeadline || null,
    userId
  ];

  const [result] = await pool.query(query, values);
  return { id: result.insertId, ...jobData, createdBy: userId };
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

  let query = "SELECT * FROM jobs WHERE is_active = TRUE AND is_deleted = FALSE";
  let countQuery = "SELECT COUNT(*) as count FROM jobs WHERE is_active = TRUE AND is_deleted = FALSE";
  const params = [];

  if (title) {
    query += " AND title LIKE ?";
    countQuery += " AND title LIKE ?";
    params.push(`%${title}%`);
  }
  if (companyName) {
    query += " AND company_name LIKE ?";
    countQuery += " AND company_name LIKE ?";
    params.push(`%${companyName}%`);
  }
  if (location) {
    query += " AND location LIKE ?";
    countQuery += " AND location LIKE ?";
    params.push(`%${location}%`);
  }
  if (jobType) {
    query += " AND job_type = ?";
    countQuery += " AND job_type = ?";
    params.push(jobType);
  }
  if (createdBy) {
    query += " AND created_by = ?";
    countQuery += " AND created_by = ?";
    params.push(createdBy);
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  const queryParams = [...params, limitNum, skip];

  const [jobs] = await pool.query(query, queryParams);
  const [countResult] = await pool.query(countQuery, params);
  const totalCount = countResult[0].count;
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
  const [jobs] = await pool.query("SELECT * FROM jobs WHERE id = ? AND is_deleted = FALSE", [id]);
  if (jobs.length === 0) {
    const error = new Error("Job not found!!");
    error.statusCode = 400;
    throw error;
  }
  return jobs[0];
};

const updateJob = async (id, updateData, userId) => {
  const [jobs] = await pool.query("SELECT * FROM jobs WHERE id = ?", [id]);
  if (jobs.length === 0) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }
  const job = jobs[0];

  if (job.created_by != userId) {
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
    ? JSON.stringify(skillsRequired.map((skill) => skill.trim().toLowerCase()))
    : job.skills_required;

  await pool.query(`
    UPDATE jobs SET 
      title = ?, description = ?, company_name = ?, location = ?, job_type = ?, 
      experience_min = ?, experience_max = ?, salary_min = ?, salary_max = ?, 
      skills_required = ?, openings = ?, application_deadline = ?
    WHERE id = ?
  `, [
    title || job.title,
    description || job.description,
    companyName || job.company_name,
    location || job.location,
    jobType || job.job_type,
    experience?.min ?? job.experience_min,
    experience?.max ?? job.experience_max,
    salary?.min ?? job.salary_min,
    salary?.max ?? job.salary_max,
    normalizedSkills,
    openings ?? job.openings,
    applicationDeadline || job.application_deadline,
    id
  ]);

  const [updatedJobs] = await pool.query("SELECT * FROM jobs WHERE id = ?", [id]);
  return updatedJobs[0];
};

const deleteJob = async (id, userId) => {
  const [jobs] = await pool.query("SELECT * FROM jobs WHERE id = ?", [id]);
  if (jobs.length === 0) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  if (jobs[0].created_by != userId) {
    const error = new Error("You cannot delete this job");
    error.statusCode = 403;
    throw error;
  }

  await pool.query("UPDATE jobs SET is_deleted = TRUE WHERE id = ?", [id]);
  return true;
};

const toggleJob = async (id, userId) => {
  const [jobs] = await pool.query("SELECT * FROM jobs WHERE id = ?", [id]);
  if (jobs.length === 0) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  if (jobs[0].created_by != userId) {
    const error = new Error("You cannot toggle this job");
    error.statusCode = 403;
    throw error;
  }

  await pool.query("UPDATE jobs SET is_active = NOT is_active WHERE id = ?", [id]);
  const [updatedJobs] = await pool.query("SELECT * FROM jobs WHERE id = ?", [id]);
  return updatedJobs[0];
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleJob,
};
