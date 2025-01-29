const Resource = require("../models/resource.model");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

exports.createResource = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) throw new ApiError(400, "All fields are required");

  if (!name.trim() || !description.trim())
    throw new ApiError(400, "All fields are required");

  const resource = await Resource.create({ name, description });

  if (!resource) throw new ApiError(400, "error creating resource");

  res
    .status(200)
    .json(new ApiResponse(200, resource, "Resource added successfully"));
});

exports.showResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find();
  res
    .status(200)
    .json(new ApiResponse(200, resources, `total: ${resources.length}`));
});

exports.showResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || id.length !== 24) throw new ApiError(400, "Invalid resource id");

  const resource = await Resource.findById(id);

  if (!resource) throw new ApiError(400, `No resource found with id ${id}`);

  res
    .status(200)
    .json(new ApiResponse(200, resource, "data retrived successfully"));
});

exports.updateResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.headers.authorization);
  if (!id || id.length !== 24) throw new ApiError(400, "Invalid resource id");

  const resource = await Resource.findById(id);

  if (!resource) throw new ApiError(400, `No resource found with id ${id}`);

  const { name, description } = req.body;

  if (Object.keys(req.body).length === 0)
    throw new ApiError(400, "Nothing to update");

  let object = {};
  if (name) object.name = name;
  if (description) object.description = description;

  const updatedResource = await Resource.findByIdAndUpdate(id, object, {
    new: true,
  });

  res
    .status(200)
    .json(new ApiResponse(200, updatedResource, "data updated successfully"));
});

exports.deleteResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || id.length !== 24) throw new ApiError(400, "Invalid resource id");

  const resource = await Resource.findById(id);

  if (!resource) throw new ApiError(400, `No resource found with id ${id}`);

  resource.deleted = true;
  await resource.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200,[],"Resource is deleted successfully"));
});
