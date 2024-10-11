const mongoose = require('mongoose');



const languageSchema = new mongoose.Schema(
    {
        name :{
            type : String,
            unique :true,
            required : [true , "Language name is required"]
        },
        code : {
            type : String,
            unique :true,
            required : [true , "Language code is required"]
        },
        urlFlag:{
            type :String,
        }
    }
);

const languageModel= new mongoose.model('language' , languageSchema);


module.exports = languageModel;