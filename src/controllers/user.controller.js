const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const generateTokens = async (id) => {
  try {
    let user = await User.findById(id);
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log(user);
    return refreshToken;
  } catch (err) {
    console.log(err);
    throw new ApiError(400, "Error while creating token");
  }
};

exports.register = asyncHandler(async (req, res) => {
  const { email, role, password } = req.body;

  if (!email || !password || !role)
    throw new ApiError(400, "All fields are required");

  if (password.length < 8)
    throw new ApiError(400, "Password should be at least 8 characters long");

  const findUser = await User.findOne({ email });

  if (findUser) throw new ApiError(400,"User already exist, try different email");

  const user = await User.create({ email, password, role });

  if (!user) throw new ApiError(400, "error creating user, try again");

  res
    .status(200)
    .json(new ApiResponse(200, { email, role }, "User created successfully"));
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, "All fields are required");

  const user = await User.findOne({ email });

  if (!user || !(await user.passwordIsCorrect(password)))
    throw new ApiError(400, "Invalid credentials");

  const refreshToken = await generateTokens(user._id);

  if (!refreshToken) throw new ApiError(400, "Error creating token, try again");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { email: user.email, role: user.role, refreshToken},
        "Successfully logged in"
      )
    );
});


exports.logout = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const option = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/"
    };

   
    return res
      .setHeader("Cache-Control", "no-store")
      .status(200)
      .clearCookie("refreshToken", option)
      .json(new ApiResponse(200, [], "Logged out successfully"));
    // res.status(200).json(new ApiResponse(200,{user:req.user},"working"));
})