const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
    {
        name:{
            type :String,
            required : [true , 'Genre name is required']
        },
        slug:{
            type :String,
            required : [true , 'Genre Slug is required']
        }
    }
);

const genreModel = mongoose.model('genre' , genreSchema);


module.exports = genreModel;
