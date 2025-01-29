const jwt = require("jsonwebtoken");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");

exports.verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.refreshToken;

    if (!token)
        throw new ApiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
   
    const user = await User.findById(decodedToken._id).select("-password");
    if (!user)
        throw new ApiError(400, "Token is invalid or expired, please login again");

    if (user.refreshToken !== token)
        throw new ApiError(400, "Token is invalid, please login again");

    req.user = user;
    return next();
});

exports.verifyRole = userRole => asyncHandler(async (req, res, next) => { 
    if (userRole !== req.user.role)
        throw new ApiError(
          401,
          `Unauthorized request, only ${userRole} can access this route`
        );
    return next();
});

