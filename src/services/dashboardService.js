const pool = require("../config/db");

const getDashboardData = async (userId, userRole) => {
  if (userRole === "employer") {
    const [jobs] = await pool.query("SELECT id, is_active FROM jobs WHERE created_by = ? AND is_deleted = FALSE", [userId]);
    
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((job) => job.is_active).length;
    const inactiveJobs = jobs.filter((job) => !job.is_active).length;
    
    let totalApplications = 0;
    let shortlistedApplications = 0;
    let rejectedApplications = 0;

    if (jobs.length > 0) {
      const jobIds = jobs.map(j => j.id);
      
      const [appStats] = await pool.query(`
        SELECT status, COUNT(*) as count 
        FROM applications 
        WHERE job_id IN (?)
        GROUP BY status
      `, [jobIds]);
      
      appStats.forEach(stat => {
        totalApplications += stat.count;
        if (stat.status === 'shortlisted') shortlistedApplications = stat.count;
        if (stat.status === 'rejected') rejectedApplications = stat.count;
      });
    }

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
    const [appStats] = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM applications 
      WHERE applicant_id = ?
      GROUP BY status
    `, [userId]);
    
    let totalApplications = 0;
    let appliedApplications = 0;
    let shortlistedApplications = 0;
    let rejectedApplications = 0;

    appStats.forEach(stat => {
      totalApplications += stat.count;
      if (stat.status === 'applied') appliedApplications = stat.count;
      if (stat.status === 'shortlisted') shortlistedApplications = stat.count;
      if (stat.status === 'rejected') rejectedApplications = stat.count;
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
