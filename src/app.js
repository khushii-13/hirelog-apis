const express = require("express");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const jobRouter = require("./routes/job");
const applicationRouter = require("./routes/application");
const dashboardRouter = require("./routes/dashboard");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/public/auth", authRouter);
app.use("/api/private/users", userRouter);
app.use("/api/private/job", jobRouter);
app.use("/api/private/applications", applicationRouter);
app.use("/api/private/dashboard", dashboardRouter);



app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
