const pool = require("../config/db");

const applyForJob = async (jobId, userId) => {
  const [jobs] = await pool.query("SELECT * FROM jobs WHERE id = ?", [jobId]);
  if (jobs.length === 0) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }
  const job = jobs[0];

  if (job.is_deleted) {
    const error = new Error("This job is no longer available");
    error.statusCode = 400;
    throw error;
  }

  const [existingApplication] = await pool.query("SELECT * FROM applications WHERE job_id = ? AND applicant_id = ?", [jobId, userId]);
  
  if (existingApplication.length > 0) {
    const error = new Error("You have already applied for this job");
    error.statusCode = 400;
    throw error;
  }

  const [result] = await pool.query(
    "INSERT INTO applications (job_id, applicant_id) VALUES (?, ?)",
    [jobId, userId]
  );

  return { id: result.insertId, jobId, applicantId: userId, status: 'applied' };
};

const getMyApplications = async (userId, options = {}) => {
  const { page = 1, limit = 10, status } = options;

  let query = `
    SELECT a.*, j.title, j.company_name, j.location, j.job_type 
    FROM applications a 
    JOIN jobs j ON a.job_id = j.id 
    WHERE a.applicant_id = ?
  `;
  let countQuery = "SELECT COUNT(*) as count FROM applications WHERE applicant_id = ?";
  const params = [userId];

  if (status) {
    query += " AND a.status = ?";
    countQuery += " AND status = ?";
    params.push(status);
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  query += " ORDER BY a.applied_at DESC LIMIT ? OFFSET ?";
  const queryParams = [...params, limitNum, skip];

  const [applications] = await pool.query(query, queryParams);
  const [countResult] = await pool.query(countQuery, params);
  
  const totalCount = countResult[0].count;
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
  const [jobs] = await pool.query("SELECT * FROM jobs WHERE id = ?", [jobId]);
  if (jobs.length === 0) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  if (jobs[0].created_by != userId) {
    const error = new Error("You cannot view applications for this job");
    error.statusCode = 403;
    throw error;
  }

  const { page = 1, limit = 10, status } = options;

  let query = `
    SELECT a.*, u.name, u.email 
    FROM applications a 
    JOIN users u ON a.applicant_id = u.id 
    WHERE a.job_id = ?
  `;
  let countQuery = "SELECT COUNT(*) as count FROM applications WHERE job_id = ?";
  const params = [jobId];

  if (status) {
    query += " AND a.status = ?";
    countQuery += " AND status = ?";
    params.push(status);
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  query += " ORDER BY a.applied_at DESC LIMIT ? OFFSET ?";
  const queryParams = [...params, limitNum, skip];

  const [applications] = await pool.query(query, queryParams);
  const [countResult] = await pool.query(countQuery, params);

  const totalCount = countResult[0].count;
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
  const [applications] = await pool.query(`
    SELECT a.*, j.created_by 
    FROM applications a 
    JOIN jobs j ON a.job_id = j.id 
    WHERE a.id = ?
  `, [id]);
  
  if (applications.length === 0) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }
  
  const application = applications[0];

  if (application.created_by != userId) {
    const error = new Error("You cannot update this application");
    error.statusCode = 403;
    throw error;
  }

  await pool.query("UPDATE applications SET status = ? WHERE id = ?", [status, id]);
  
  const [updatedApplications] = await pool.query(`
    SELECT a.*, u.name, u.email 
    FROM applications a 
    JOIN users u ON a.applicant_id = u.id 
    WHERE a.id = ?
  `, [id]);
  
  return updatedApplications[0];
};

const deleteApplication = async (id, userId) => {
  const [applications] = await pool.query("SELECT * FROM applications WHERE id = ?", [id]);
  if (applications.length === 0) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  if (applications[0].applicant_id != userId) {
    const error = new Error("You cannot delete this application");
    error.statusCode = 403;
    throw error;
  }

  await pool.query("DELETE FROM applications WHERE id = ?", [id]);
  return true;
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
};
