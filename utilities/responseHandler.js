/**
 * Send a 400 Bad Request response with a specific message.
 *
 * @param {Object} res - The response object from the Express framework.
 * @param {String} message - The message to be returned within the response.
 * @returns {Object} The JSON response object with status and message.
 */
const badRequestResponse = (res , message) => {
  return res.status(400).json({
      status: "fail",
      message: message,
  });
};

/**
 * Send a 404 Not Found response with a specific model name.
 *
 * @param {Object} res - The response object from the Express framework.
 * @param {String} modelName - The name of the model that was not found.
 * @returns {Object} The JSON response object with status and message.
 */
const notFoundResponse = (res, modelName) => {
  const capitalizedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  res.status(404).json({
    status: "fail",
    message: `${capitalizedModelName} not found, please check the info provided`,
  });
};

/**
 * Send a 500 Internal Server Error response and log the error.
 *
 * @param {Object} res - The response object from the Express framework.
 * @param {Error} error - The error object to log for debugging.
 * @returns {Object} The JSON response object with status and message.
 */
const internalErrorResponse = (res, error) => {
  console.log(error);
  res.status(500).json({
    status: "fail",
    message: "Internal server error, please try again later",
  });
};

/**
 * Send a success response with a specific status code, status text, and data.
 *
 * @param {Object} res - The response object from the Express framework.
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {String} statusText - The status text for the response.
 * @param {Object} data - The created or updated object
 * @returns {Object} The JSON response object with status and data.
 */
const successResponse = (res, statusCode, statusText, data) => {
  res.status(statusCode).json({
    status: statusText,
    data: data
  });
};

module.exports = { successResponse,badRequestResponse, notFoundResponse, internalErrorResponse };
