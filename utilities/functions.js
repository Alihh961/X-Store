/**
 * Validate if the provided ids array is valid( not null , valid mongodb id)
 *
 * @param {Array} ids - An array of MongoDB Object IDs.
 * @param {String} modelName - The name of the model for error reporting.
 * @throws Will throw an error if ids is not an array or contains invalid Object IDs.
 */
function checkMongoIdValidation(ids, modelName) {
  if (ids.length === 0) {
    return {
      error: { message: `No ids provided for ${modelName}.`, status: "fail" },
    };
  }

  for (const id of ids) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return {
        error: {
          message: `The id: ${id} is not a valid MongoDB ID for ${modelName}.`,
          status: "fail",
        },
      };
    }
  }

  return true;
}


module.exports = { checkMongoIdValidation };
