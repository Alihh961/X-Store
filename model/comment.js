const mongoose = require('mongoose');
const validator = require('validator');


const commentSchema = new mongoose.Schema(
    {
        content : {
            type:String,
            required : [ true , "Message content can't be empty"]
        },
        totalVotesUp : {
            type : Number,
            validate: [{
                validator: Number.isInteger,
                message: "Only Integers are allowed",
              },
              {
                validator : (value)=> value >= 0,
                message : "Only positive integers are allowed"
               }]
            
        },
        totalVotesDown : {
            type :Number,
            validate: [{
                validator: Number.isInteger,
                message: "Only Integers are allowed",
              },
              {
                validator : (value)=> value >= 0,
                message : "Only positive integers are allowed"
               }]
        },
        createdAt :{
            type :Date,
            required : [true , "CreatedAt date is required"]
        }
    }
);


commentSchema.pre('save' , (next)=>{
    if(this.isNew){
        this.totalUpVotes = 0;
        this.totalVotesDown = 0;
    }
    next();
});

const commentModel = new mongoose.model('comment' , commentSchema);

module.exports = commentModel;