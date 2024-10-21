const languageModel = require("../../model/language");
const fs = require("fs");
const path = require("path");
const checkMongoIdValidation = require('../../utilities/functions').checkMongoIdValidation;


const addLanguage = async (req, res) => {
  const name = req.body.name;
  const code = req.body.code;
  const urlFlag = req.file.filename;

  const filePath = path.join(
    __dirname,
    "../public/uploads/images/languagesFlag/" + code,
    req.file.filename /* the new filename from multer*/
  );

  if (!name || !code || !urlFlag) {
    // Check if the file was uploaded and delete it because there is an error in creating the model
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`);
      }
    });
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
  }

  try {
    const language = new languageModel({
      name,
      code,
      urlFlag,
    });

    await language.save();

    const oldFolder = path.join(
      __dirname,
      `../public/uploads/images/languagesFlag`
    );
    const newFolder = path.join(
      __dirname,
      `../public/uploads/images/languagesFlag/${code}`
    );

    // create the new folder if doesnt exists
    if (!fs.existsSync(newFolder)) {
      fs.mkdirSync(newFolder);
    }

    const oldFileLocation = oldFolder + "/" + urlFlag;
    const newFileLocation = newFolder + "/" + urlFlag;

    fs.rename(oldFileLocation, newFileLocation, function (err) {
      if (err) throw err;
    });

    return res.status(201).json({
      message: "Language added successfully",
      data: {
        language,
      },
      status: "success",
    });
  } catch (error) {

    const filePath = path.join(
      __dirname,
      "../public/uploads/images/languagesFlag" ,
      req.file.filename /* the new filename from multer*/
    );

    // Check if the file was uploaded and delete it because there is an error in creating the model
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`);
      }
    });

    if (error.code === 11000) {
      let duplicatedKey = Object.keys(error.keyPattern)[0];
      const capitalizedDuplicatedKey =
        duplicatedKey.charAt(0).toUpperCase() + duplicatedKey.slice(1);
        const genre =  await genreModel.findById(id);

        if(!genre){
          return res.status(404).json({
            message : "No genre related to the given id: " + genreId ,
            status : 'fail'
          })
        }
      
        return res.status(200).json({
          data : {genre},
          status : 'success'
        })
    }

    return res.status(400).json({
      message: error.message,
      status: "fail",
    });
  }
};

const getLanguageById = async (req, res) => {
  const languageId = req.params.id;


  if(checkMongoIdValidation([languageId] , 'language').error){
    let error = checkMongoIdValidation([languageId], "language").error;
    return res.status(400).json({
      message: error.message,
      status: error.status,
    });
  }

  try {
    const language = await languageModel.findById(languageId);

    if (!language) {
      return res.status(404).json({
          message : "No language found for the provided id: " + languageId,
          status :'fail'
      })
    }

    return res.status(200).json({
      data: {
        language,
      },
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })
  }
};

const deleteLanguageById = async (req, res) => {
  const languageId = req.params.id;

  if(checkMongoIdValidation([languageId] , 'language').error){
    let error = checkMongoIdValidation([languageId], "language").error;
    return res.status(400).json({
      message: error.message,
      status: error.status,
    });
  }

  try {
    const language = await languageModel.findById(languageId);

    if (!language) {
      throw { message: "No Language for the provided id: " + languageId };
    }
    await languageModel.findByIdAndDelete(languageId);

    const folderPath = path.join(__dirname , `../public/uploads/images/languagesFlag/${language.code}`);

  
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error('Error while deleting folder:', err);
      }});

    return res.status(200).json({
      message: "Deleted successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })
  }
};

const updateLanguageById = async (req, res) => {
  const languageId = req.params.id;

  if(checkMongoIdValidation([languageId] , 'language').error){
    let error = checkMongoIdValidation([languageId], "language").error;
    return res.status(400).json({
      message: error.message,
      status: error.status,
    });
  }
  
  const updateFields = {};

  if (req.body.name) updateFields.name = req.body.name;
  if (req.body.code) updateFields.code = req.body.code;
  if(req.file) updateFields.urlFlag = req.file.filename;


  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      message:
        "At least one of Name, Code, or Flag URL must be provided for update",
      status: "fail",
    });
  }

  try {


    if(updateFields.urlFlag){
      var oldLanguage = await languageModel.findById(languageId);
      if(!oldLanguage){
        return res.status(404).json({
          message : "No language for the provided id: " + languageId,
          status: 'fail'
        })
      }
    }
    

    let language = await languageModel.findByIdAndUpdate(
      languageId,

      updateFields,

      {
        new: true,
      }
    );

    if(oldLanguage){
      const oldFileName = path.join(__dirname, '../public/uploads/images/languagesFlag', oldLanguage.code,oldLanguage.urlFlag);
      const newFileName = path.join(__dirname, '../public/uploads/images/languagesFlag', oldLanguage.code,language.urlFlag);

    console.log({oldFileName , newFileName})
      fs.rename(oldFileName , newFileName , (error)=>{
        console.log('Error while renaming the file for language of id: ' +languageId);
      })


      // delete the file that recreated in languagesFlag folder
      const pathFileToDelete = path.join(__dirname ,'../public/uploads/images/languagesFlag/' ,language.urlFlag);
      fs.unlink(pathFileToDelete, (err) => {
        if (err) {
          console.error('Error while deleting the file:', err);
        } else {
          console.log('File deleted successfully!');
        }
      });

    }


    return res.status(200).json({
      message : 'Updated successfully',
      status :'success',
      data : {
        language
      }
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

    console.log(error);
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })
  }
};

module.exports = {
  addLanguage,
  deleteLanguageById,
  getLanguageById,
  updateLanguageById,
};
