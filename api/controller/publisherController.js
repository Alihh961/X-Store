const publisherModel = require("../../model/publisher");

const addPublisher = async function (req, res) {
  const name = req.body.name;

  if (!name) {
    return res.status("400").json({
      status: "fail",
      message: "Publisher name is required",
    });
  }
  let newPublisher = new publisherModel({
    name,
  });

  try {
    const publisher = await newPublisher.save();

    return res.status(200).json({
      status: "success",
      message: "Pubisher added successfully",
      data: {
        publisher,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message:
          "Publisher name already exists, please choose a different name",
      });
    }
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deletePublisherById = async function (req, res) {
  const publisherId = req.params.id;

  if (!publisherId.match(/^[0-9a-fA-F]{24}$/) || !publisherId) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
    });
  }
  try {
    const publisher = await publisherModel.findById(publisherId);
    if (!publisher) {
      return res.status(404).json({
        message: "No publisher was found for the provided ID:" + publisherId,
        status: "fail",
      });
    }

    await publisherModel.findByIdAndDelete(publisherId);

    return res.status(200).json({
      message: "Publisher deleted successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      status: "fail",
    });
  }
};

const updatePublisherNameById = async function (req, res) {

  const publisherId = req.params.id;
  const newPublisherName = req.body.name;
  

  if (!publisherId.match(/^[0-9a-fA-F]{24}$/) || !publisherId) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
    });
  }

  if (!newPublisherName) {
    return res.status(400).json({
      message: "New name is required",
      status: "fail",
    });
  }

  try {
    const publisher = await publisherModel.findById(publisherId);

    if (!publisher) {
      return res.status(404).json({
        message: "No publisher was found for the provided ID: " + publisherId,
        status: "fail",
      });
    }

    const updatedPublisher = await publisherModel.findByIdAndUpdate(
      publisherId,
      { name: newPublisherName },
      { new: true }
    );
    return res.json(updatedPublisher)

    return res.status(200).json({
      message: "Publisher name udpated successfully",
      status: "success",
      data: {
        publisher: updatedPublisher,
      },
    });
  } catch (error) {
    if(error.code === 11000
    ){
        return res.status(400).json({
            message : 'Publisher name already exists, please choose a different name',
            status : 'fail'
        })
    }
    return res.status(400).json({
        message : error.message,
        status : 'fail'
    })
  }
};

const getPublisherById = async function(req , res){
    const publisherId = req.params.id;


    if (!publisherId.match(/^[0-9a-fA-F]{24}$/) || !publisherId) {
        return res.status(400).json({
          message: "ID is not a valid MongoDB _id, Please Check ID",
          status: "fail",
        });
      }

      try{
        const publisher = await publisherModel.findById(publisherId);

        if(!publisher){
          return res.status(400).json({
              message : "No publisher was found for the provided ID: " + publisherId ,
              status : 'fail'
          })
        }

        return res.status(200).json({
            data: {
                publisher
            },
            status :'success'
        })
      }catch(error){
        return res.status(400).json({
            message : error.message,
            status : 'fail'
        })
      }
    



};

const getPublisherByName = async function(req , res){
    const publisherName = req.params.name;


    if (!publisherName) {
        return res.status(400).json({
          message: "Publisher name is required",
          status: "fail",
        });
      }

      try{
        const publisher = await publisherModel.findOne({name: publisherName});

        if(!publisher){
          return res.status(404).json({
              message : "No publisher found for the name: " + publisherName ,
              status : 'fail'
          })
        }

        return res.status(200).json({
            data: {
                publisher
            },
            status :'success'
        })
      }catch(error){
        return res.status(400).json({
            message : error.message,
            status : 'fail'
        })
      }
    



}

module.exports = { addPublisher, deletePublisherById, updatePublisherNameById , getPublisherById , getPublisherByName};
