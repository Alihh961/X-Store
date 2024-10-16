const { response } = require("express");
const publisherModel = require("../model/publisher");
const checkMongoIdValidation = require('../utilities/functions').checkMongoIdValidation;
const responseHandler =  require('../utilities/responseHandler')


const addPublisher = async function (req, res) {
  const name = req.body.name;

  if (!name) {
    return responseHandler.badRequestResponse(res , "Publisher name is required");
  }
  let newPublisher = new publisherModel({
    name,
  });

  try {
    const publisher = await newPublisher.save();

    return responseHandler.successResponse(res , 201 , "Created successfully" , publisher);
    
  } catch (error) {
    if (error.code === 11000) {
      return responseHandler.badRequestResponse(res , "Publisher name already exists, please choose a different name");
    }
    return responseHandler.internalErrorResponse(res , error);
  }
};

const deletePublisherById = async function (req, res) {
  const publisherId = req.params.id;

  if(checkMongoIdValidation([publisherId] , 'publisher').error){
    let error = checkMongoIdValidation([publisherId], "publisher").error;
    return responseHandler.badRequestResponse(res , error.message);
  }
  try {
    const publisher = await publisherModel.findById(publisherId);
    if (!publisher) {
      return responseHandler.badRequestResponse(res, "publisher");
    }

    await publisherModel.findByIdAndDelete(publisherId);

    return responseHandler.successResponse(res, 200 , "Deleted successfully");
  } catch (error) {
    return responseHandler.internalErrorResponse(res, error);
  }
};

const updatePublisherNameById = async function (req, res) {

  const publisherId = req.params.id;
  const newPublisherName = req.body.name;
  

  if(checkMongoIdValidation([publisherId] , 'publisher').error){
    let error = checkMongoIdValidation([publisherId], "publisher").error;
    return responseHandler.badRequestResponse(res , error.message);
  }

  if (!newPublisherName) {
    return responseHandler.badRequestResponse(res , 'Name is required')
  }

  try {
    const publisher = await publisherModel.findById(publisherId);

    if (!publisher) {
      return responseHandler.notFoundResponse(res , 'publisher')
    }

    const updatedPublisher = await publisherModel.findByIdAndUpdate(
      publisherId,
      { name: newPublisherName },
      { new: true }
    );

    return responseHandler.successResponse(res , 200 , "Updated successfully" , updatedPublisher);
    
  } catch (error) {
    if(error.code === 11000
    ){
        return responseHandler.badRequestResponse(res , "Publisher name already exists, please choose a different name" )
    }
    return responseHandler.internalErrorResponse(res ,error);
  }
};

const getPublisherById = async function(req , res){
    const publisherId = req.params.id;


    if(checkMongoIdValidation([publisherId] , 'publisher').error){
      let error = checkMongoIdValidation([publisherId], "publisher").error;
      return responseHandler.badRequestResponse(res, error.message);
    }

      try{
        const publisher = await publisherModel.findById(publisherId);

        if(!publisher){
          return responseHandler.notFoundResponse(res , "publisher")
        }

        return responseHandler.successResponse(res , 200 , "success" , publisher);
      }catch(error){
        return responseHandler.internalErrorResponse(res , error);
      }
    



};



module.exports = { addPublisher, deletePublisherById, updatePublisherNameById , getPublisherById };
