const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
    {
        name:{
            type :String,
            unique :true,
            required : [true , 'Genre name is required']
        },
        slug:{
            type :String,
            unique :true,
            required : [true , 'Genre Slug is required']
        }
    }
);

const genreModel = mongoose.model('genre' , genreSchema);


module.exports = genreModel;
