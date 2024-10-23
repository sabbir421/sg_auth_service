const statusCodes = require("./statusCodes");
const errorCodes = require("./errorCodes");

function createCustomResponseMethods(res) {
  return {
    // Respond with a plain text message
    textOk: (text) => {
      res.status(statusCodes.OK).send(text);
    },

    // Respond with a success JSON object
    success: (payload = null, msg = null, error = {}, statusCode = statusCodes.OK) => {
      res.status(statusCode).json({
        status: "success",
        payload,
        error,
        msg,
      });
    },
    
    fail: (data = null, message = null, error = {}, statusCode = statusCodes.BAD_REQUEST) => {
      res.status(statusCode).json({ status: "fail", data, error, message });
    },

    // Respond with an error JSON object
    error: (code = null, message = null, error = {}, statusCode = statusCodes.INTERNAL_SERVER_ERROR) => {
      res.status(statusCode).json({ status: "error", code, error, message });
    },

    // Set the response status to OK and respond with a success JSON object
    ok: (data, message) => {
      res.status(statusCodes.OK).success(data, message);
    },

    // Set the response status to Internal Server Error and respond with an error JSON object
    internalServerError: (code, message, error) => {
      res.status(statusCodes.INTERNAL_SERVER_ERROR).error(code, message, error);
    },
  };
}

function responseHandler(req, res, next) {
  // Attach the custom response methods to the response object
  res.response = createCustomResponseMethods(res);
  next();
}

module.exports = responseHandler;
