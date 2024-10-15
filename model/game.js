const mongoose = require("mongoose");
const validator = require("validator");
// const bcrypt = require('bcryptjs');

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique :true,
      required: [true, "Name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      validate: {
        validator: Number.isInteger,
        message: "Only Integers are allowed",
      },
    },
    publishedAt: {
      type: Date,
      required: [true, "PublishedAt date is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    imageCover: {
      type: String,
      required: [true, "Cover Image is required"],
    },
    imageLogo: {
      type: String,
      required: [true, "Logo Image is required"],
    },
    slug: {
      type: String,
      unique :[true , "Game slug is unique"],
      required: [true, "Slug is required"],
    },
    languages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
      required: [true, "At least one language is required"],
    }],
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Genre",
      required: [true, "At least one genre is required required"],
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Publisher",
      required: [true, "Publisher is required"],
    },
    totalDownVotes: {
      type: Number,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Only Integers are allowed",
      },
    },
    totalUpVotes: {
      type: Number,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Only Integers are allowed",
      },
    },
  },
  {
    toJSON: { virtuals: true }, // this is to get the virtual properties to be displayed in the output
    toObject: { virtuals: true },
  }
);

// Virtual field to calculate the average rank
gameSchema.virtual("averageRank").get(function () {
  const totalVotes = this.totalUpVotes + this.totalDownVotes;
  if (totalVotes === 0) {
    return 0;
  }
  return this.totalUpVotes / totalVotes;
});

const gameModel = mongoose.model("game", gameSchema);

module.exports = gameModel;