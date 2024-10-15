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
        },
        game : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Game',
            required : false,

        }]
    }
);

const genreModel = mongoose.model('genre' , genreSchema);


module.exports = genreModel;
