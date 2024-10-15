const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema(
    {
        name: {
            type : String,
            trim :true,
            unique : [true , 'Publisher name already exists'],
            required : [true , 'Publisher name is required']
        },
        game : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Game',
        }]
    }
)

const publisherModel = mongoose.model('publisher' , publisherSchema);


module.exports = publisherModel;