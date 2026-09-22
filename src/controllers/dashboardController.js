const dashboardService = require("../services/dashboardService");
const sendResponse = require("../utils/response");
const errorHandler = require("../utils/error");

const dashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData(
      req.user.id,
      req.user.role,
    );
    return sendResponse(
      res,
      200,
      true,
      "Dashboard data retrieved successfully",
      data,
    );
  } catch (error) {
    return errorHandler(error, res);
  }
};

module.exports = { dashboard };
