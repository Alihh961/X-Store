const mongoose = require('mongoose');



const languageSchema = new mongoose.Schema(
    {
        name :{
            type : String,
            required : [true , "Language name is required"]
        },
        code : {
            type : String,
            required : [true , "Language code is required"]
        },
        urlFlag:{
            type :String,
            required : [ true , "Language Flag image is requried"]
        }
    }
);

const languageModel= new mongoose.model('language' , languageSchema);


module.exports = languageModel;