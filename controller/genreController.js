const genreModel = require("../model/genre");
const checkMongoIdValidation = require('../utilities/functions').checkMongoIdValidation;


const addGenre = async (req, res) => {
  const genreName = req.body.name;
  const genreSlug = req.body.slug;

  if (!genreName) {
    return res.status(400).json({
      message: "Genre name is required",
      status: "fail",
    });
  }
  if (!genreSlug) {
    return res.status(400).json({
      message: "Genre slug is required",
      status: "fail",
    });
  }

  const genre = new genreModel({ name: genreName, slug: genreSlug });

  try {
    const newGenre = await genre.save();

    return res.status(200).json({
      message: "Genre created successfully",
      data: {
        newGenre,
      },
      status: "success",
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Genre name or genre slug already exists",
        status: "fail",
      });
    }
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })
  }
};

const updateGenreById = async (req, res) => {
  const genreId = req.params.id;
  const genreName = req.body.name;
  const genreSlug = req.body.slug;

  if (!genreId || !genreId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
    });
  }

  if (!genreName && !genreSlug) {
    return res.status(400).json({
      message: "No name or slug provided",
      status: "fail",
    });
  }

  try {
    let updatedGenre;

    if(genreName && genreSlug){
        updatedGenre = await genreModel.findByIdAndUpdate( 
            genreId,
            {name : genreName , slug : genreSlug},
            {new : true}
        )
    }else if(genreName){

        updatedGenre = await genreModel.findByIdAndUpdate( 
            genreId,
            {name : genreName},
            {new : true}
        )
    }else if(genreSlug){
        updatedGenre = await genreModel.findByIdAndUpdate( 
            genreId,
            {slug : genreSlug},
            {new : true}
        )
    }

    return res.status(200).json({
        message : "Genre updated successfully",
        data : {
            genre : updatedGenre
        },
        status : "success"
    })

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Genre name or genre slug already exists",
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

const deleteGenreById = async(req,res)=>{
    const genreId = req.params.id;

    if (!genreId || !genreId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          message: "ID is not a valid MongoDB _id, Please Check ID",
          status: "fail",
        });
      }

      try{

        await genreModel.findByIdAndDelete(genreId);

        return res.status(200).json({
            message : "Genre deleted successfully",
            status : "success"
        })

      }catch(error){
        console.log(error);
        return res.status(500).json({
            message : 'Internal error',
            status :'fail'
        })
      }

};

const getGenreById = async (req,res)=>{
  const genreId = req.params.id;

  if (!genreId || !genreId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
    });
  }

  try{
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
  }catch(error){
    console.log(error);
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })
  }




}


module.exports = { addGenre , updateGenreById ,deleteGenreById ,getGenreById };
