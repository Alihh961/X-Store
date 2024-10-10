const languageModel = require("../model/language");
const fs = require("fs");

const addLanguage = async (req, res) => {
  const name = req.body.name;
  const code = req.body.code;
  const urlFlag = req.body.urlFlag;

  if (!name) {
    return res.status(422).json({
      message: "Name is required",
      status: "fail",
    });
  }
  if (!code) {
    return res.status(422).json({
      message: "Code is required",
      status: "fail",
    });
  }
  if (!urlFlag) {
    return res.status(422).json({
      message: "Image is required",
      status: "fail",
    });
  }

  try {
    const language = new languageModel({
      name,
      code,
      urlFlag,
    });

    await language.save();

    return res.status(201).json({
      message: "Language added successfully",
      data: {
        language,
      },
      status: "success",
    });
  } catch (error) {
    if (error.code === 11000) {
      let duplicatedKey = Object.keys(error.keyPattern)[0];
      const capitalizedDuplicatedKey =
        duplicatedKey.charAt(0).toUpperCase() + duplicatedKey.slice(1);
      return res.status(400).json({
        message: `${capitalizedDuplicatedKey} language must be unique`,
        status: "fail",
      });
    }

    return res.status(400).json({
      message: error.message,
      status: "fail",
    });
  }
};

const getLanguageById = async (req, res) => {
  const languageId = req.params.id;

  if (!languageId || !languageId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
    });
  }

  try {
    const language = await languageModel.findById(languageId);

    if (!language) {
      throw {
        message: "No language found for the provided id: " + languageId,
        status: 404,
      };
    }

    return res.status(200).json({
      data: {
        language,
      },
      status: "success",
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      message: error.message,
      status: "fail",
    });
  }
};

const removeLanguageById = async (req, res) => {
  const languageId = req.params.id;

  if (!languageId || !languageId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
    });
  }

  try {
    const language = await languageModel.findById(languageId);

    if (!language) {
      throw { message: "No Language for the provided id: " + languageId };
    }
    await languageModel.findByIdAndDelete(languageId);

    return res.status(200).json({
      message: "Deleted successfully",
      status: "fail",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      status: "fail",
    });
  }
};

const updateLanguageById = async (req, res) => {
  const languageId = req.params.id;
  if (!languageId || !languageId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
    });
  }

  const updateFields = {};

  if (req.body.name) updateFields.name = req.body.name;
  if (req.body.code) updateFields.code = req.body.code;
  if (req.body.urlFlag) updateFields.urlFlag = req.body.urlFlag;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      message: "At least one of Name, Code, or Flag URL must be provided for update",
      status: "fail"
    });
  }

  try {
    let language = await languageModel.findByIdAndUpdate(
      languageId,
      
        updateFields,
      
      {
        new: true,
      }
    );

    if(!language){
        throw { message : 'Language not found'}
    }

    return res.json(language);
  } catch (error) {
    if (error.code === 11000) {

        let duplicatedKey = Object.keys(error.keyPattern)[0];
        const capitalizedDuplicatedKey =
          duplicatedKey.charAt(0).toUpperCase() + duplicatedKey.slice(1);
        return res.status(400).json({
          message: `${capitalizedDuplicatedKey} language must be unique`,
          status: "fail",
        });
      }

    return res.json({
      message: error.message,
      status: "fail",
    });
  }
};


module.exports = {
  addLanguage,
  removeLanguageById,
  getLanguageById,
  updateLanguageById,
};
