const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (err) {
    // console.log(err);
    if (process.env.PRODUCTION !== "FALSE") {
      return res.status(err.statusCode || 500).json({
        status: "failed",
        message: err.message,
        err,
      });
    } else {
       if (err.errorResponse?.code === 11000) {
         let msg = "";
         Object.entries(err.keyPattern).map((e) => {
           msg += e[0] + " ";
         });

         msg = `${msg} already in use`
         return res.status(err.statusCode || 500).json({
           status: "failed",
           message: msg ? msg : "plz check email and ph no"
         });
       }
      
        if (err?.name === "ValidationError") {
          let message = "";
          Object.entries(err.errors).forEach(([k, v]) => {
            message += `${v.message}, `;
          });
          message = message.substring(0, message.length - 2);
          return res.status(err.statusCode || 500).json({
            status: "failed",
            message: message ? message : "Validation error",
          });
        }
      return res.status(err.statusCode || 500).json({
        status: "failed",
        message: err.message,
      });
    }
  }
};

module.exports = asyncHandler;
