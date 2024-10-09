const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email format"],
      trim: true,
    },
    credit: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          message: "Only Integers are allowed",
        },
        {
          validator: (value) => value >= 0,
          message: "Credit can't be negative",
        },
      ],
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: [8, "Password length: At least 8 letters"],
      select: false,
      trim: true,
    },
    confirmedPassword: {
      type: String,
      trim: true,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (val) {
          return val === this.password; // this refers to the document
        },
        message: "Password and confirm password must be equal",
      },
    },
    giftLastTimeClaimedAt : {
      type : Date,
      required : false
    }
  },
  {
    toJSON: { virtuals: true }, // this is to get the virtual properties to be displayed in the output
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmedPassword = undefined;
  next();
});

userSchema.methods.comparingPasswordInDB = async function (
  password,
  passwordDB
) {
  return await bcrypt.compare(password, passwordDB);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
