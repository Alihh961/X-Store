const userModel = require('../model/game');
const validator = require('validator');
const gameModel = require('../model/game');



const getGameById = async(req ,res)=>{
    const id = req.params.id;

    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/) || !id) {
          return res.status(400).json({
            message: "ID is not a valid MongoDB _id, Please Check ID",
            status: "fail",
          });
        }
    
        const user = await userModel.findById(id);
    
        if (!user) {
          return res.status(404).json({
            status: "fail",
            message: `No user found for the provided id : ${id}`,
          });
        }
    
        return res.status(200).json({
          data :{
            user
          },
          status: "success",
        });
    
      } catch (error) {
        return res.status(500).json({
          status : 'error',
          message : error.message
        });
      }

    return res.send('sexes');
}

const addGame = async(req,res)=>{
  const { name, price, publishedAt, description, imageCover, imageLogo, slug, language, genre, publisher } = req.body;

  const gameExists = await gameModel.findOne({name}) || await gameModel.findOne({slug});
  
  if(gameExists){
    return res.status(400).json({
      message :"Name and slug must be unique",
      status: 'fail'
    })
  }
  try{

    const game = new gameModel({
      name,
      price,
      publishedAt,
      description,
      imageCover,
      imageLogo,
      slug,
      language,
      genre,
      publisher,

    });
    await game.save();

    return res.status(201).json({
      message : "Game created successcully",
      data : {
        game
      },
      status :'success'
    })



  }catch(error){

    return res.status(400).json({
      message : error.message,
      status: 'fail'
    })
  }

}

const updateGameById = async (req,res)=>{
  const gameId = req.params.id;
  const changes = req.body;

  if (!gameId.match(/^[0-9a-fA-F]{24}$/) || !gameId) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
    });
  }


  try{


    const game = await gameModel.findById(gameId);
    if(!game){
      return res.status(404).json({
        message : "No game for the provided id " + gameId,
        status : 'fail'
      })
    }

    // to insure that images wont be change here , another method will takecare of changing images
    if ('imageCover' in changes) {
      delete changes.imageCover;
    }
    if ('imageLogo' in changes) {
      delete changes.imageLogo;
    }


    const updatedGame = await gameModel.findByIdAndUpdate(
      gameId,
      changes,
      {new : true}
    )

    return res.status(201).json({
      message : "Game updated successfully",
      data : {
        updatedGame
      },
      status : 'success',
    
    })


  }catch(error){
    if(error.code === 11000){
      return res.status(400).json({
        message : 'Name and slug are unique',
        status : 'fail'
      })
    }
    return res.status(400).json({
      message : error.message,
      status : 'fail'
    })
  }
}

const deleteGameById = async (req,res)=>{
  const gameId = req.params.id;

  if (!gameId.match(/^[0-9a-fA-F]{24}$/) || !gameId) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
    });
  }
  const game = await gameModel.findById(gameId);

  if(!game){
    return res.status(404).json({
      message : `No game related to the id ${gameId} was found`,
      status : 'fail'
    })
  }

  try{

  await gameModel.findByIdAndDelete(gameId);
  return res.status(200).json({
    message : 'Game Deleted successfully',
    status : 'success'
  })
    
  }catch(error){
    return res.status(400).json({
      message : error.message,
      status : 'fail'
    })
  }




}


module.exports = {getGameById , addGame , updateGameById , deleteGameById}