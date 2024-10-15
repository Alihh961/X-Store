const mongoose = require('mongoose');



const languageSchema = new mongoose.Schema(
    {
        name :{
            type : String,
            unique :true,
            trim :true,
            required : [true , "Language name is required"]
        },
        code : {
            type : String,
            trim :true,
            unique :true,
            required : [true , "Language code is required"]
        },
        urlFlag:{
            type :String,
        },
        game:[{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Game',
            required : false
        }]
    }
);

const languageModel= new mongoose.model('language' , languageSchema);


module.exports = languageModel;