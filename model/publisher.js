const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema(
    {
        name: {
            type : String,
            unique : [true , 'Publisher name already exists'],
            required : [true , 'Publisher name is required']
        }
    }
)

const publisherModel = mongoose.model('publisher' , publisherSchema);


module.exports = publisherModel;