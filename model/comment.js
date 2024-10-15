const mongoose = require("mongoose");
const validator = require("validator");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    trim : true,
    required: [true, "Message content can't be empty"],
  },
  totalVotesUp: {
    type: Number,
    validate: [
      {
        validator: Number.isInteger,
        message: "Only Integers are allowed",
      },
      {
        validator: (value) => value >= 0,
        message: "Only positive integers are allowed",
      },
    ],
  },
  totalVotesDown: {
    type: Number,
    validate: [
      {
        validator: Number.isInteger,
        message: "Only Integers are allowed",
      },
      {
        validator: (value) => value >= 0,
        message: "Only positive integers are allowed",
      },
    ],
  },
  createdAt: {
    type: Date,
    required: [true, "CreatedAt date is required"],
    default : Date.now
  },
  game: {
    type : mongoose.Types.ObjectId,
    ref : 'game',
    required :true
  }
});

commentSchema.pre("save", (next) => {
  if (this.isNew) {
    this.totalVotesUp = 0;
    this.totalVotesDown = 0;
  }

  next();
});

const commentModel = new mongoose.model("comment", commentSchema);

module.exports = commentModel;
