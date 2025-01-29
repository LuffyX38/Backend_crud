const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({path:"./.env"})

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json("Deploying on vercel");
})

const userRoute = require("./src/routes/user.route");
const resourceRoute = require("./src/routes/resource.route");

app.use("/api/v1/user", userRoute);
app.use("/api/v1/resource", resourceRoute);

module.exports = app;