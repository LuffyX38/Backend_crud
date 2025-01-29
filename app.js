const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({path:"./.env"})

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
      message: "Deploying on vercel",
      
    });
})

const userRoute = require("./src/routes/user.route");
const resourceRoute = require("./src/routes/resource.route");
const asyncHandler = require("./src/utils/asyncHandler");
const ApiError = require("./src/utils/ApiError");

app.use("/api/v1/user", userRoute);
app.use("/api/v1/resource", resourceRoute);

app.get("*", asyncHandler((req, res) => {
    throw new ApiError(404,"No page found")
}))

module.exports = app;