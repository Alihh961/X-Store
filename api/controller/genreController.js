const genreModel = require('../../model/genre');

const addGenre = async (req,res)=>{

    const genreName = req.body.name;
    const genreSlug = req.body.slug;

    if(!genreName){
        return res.status(400).json({
            message : "Genre name is required",
            status : "fail"
        })
    }
    if(!genreSlug){
        return res.status(400).json({
            message : "Genre slug is required",
            status : "fail"
        })
    }

    const genre = new genreModel({name : genreName , slug : genreSlug});

    try{

        const newGenre = await genre.save();

        return res.status(200).json({
            message : "Genre created successfully",
            data : {
                newGenre
            },
            status : "success"
        })
        
    }catch(error){
        if(error.code === 11000){
            return res.status(400).json({
                message : "Genre name or genre slug already exists",
                status : "fail"
            })
        }
        return res.status(400).json({
            message : error.message,
            status : "fail"
        })
    }
}


module.exports = { addGenre}