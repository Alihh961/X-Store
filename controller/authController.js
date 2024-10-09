const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user");

const maxAge = 30 * 24 * 60 * 60;

const signup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.confirmedPassword;
  const credit = 50;

  try {
    const emailExists = await userModel.findOne({ email });
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if (!email) {
        throw {
          message: `Email is required`,
        }
    }

    if (!name) {
        throw {
          message: `Name is required`,
        }
    }
    if(!password || !confirmedPassword){
        throw {
            message: `Both password and confirmed password are required`,
          };
    }
    if (emailExists) {
      throw {
        message: `An account with the email address '${email}' already exists. Please use a different email or try logging in.`,
      };
    }
    if (password !== confirmedPassword) {
      throw {
        status: "fail",
        message: `Password and confirmed password must be equal`,
      };
    }
    if(!passwordRegex.test(password)){
      throw { message: "Password must contain at least one uppercase letter, one lowercase letter, and be at least 8 characters long." };

    }

    const user = new userModel({
      name,
      email,
      password,
      confirmedPassword,
      credit
    });
    await user.save();

    user.password = undefined;
    const token = signToken(user._id,name);



    res.status(201).json({
      message: "User added successfully",
      data: {
        user,
        token
      },
      status: 201,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      status: "fail",
    });
  }
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    var user = await userModel.findOne({ email }).select("+password");

    if (!email || !password) {
      throw {
        message: "Please provide an email and password!",
        statusCode: 400,
      };
    }

    if (!user || !(await user.comparingPasswordInDB(password, user.password))) {
      throw { message: "Invalid credentials", statusCode: 401 };
    }

    // to deselect the password
    user = await userModel.findOne({ email });

    const token = signToken(user._id, user.userName);

    // httpOnly (true) means that the user can't access the cookie from the browser like the console
    res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 }); // * 1000 because in the cookie it is treated in milliseconds

    return res.status(200).json({
      status: "success",
      statusCode: 200,
        data :{
            user,
            token
        }
    });
  } catch (error) {
    return res.json({ message: error.message, statusCode: error.statusCode });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("jwtG", "", { maxAge: 1 });

  res.redirect("/");
};

const signToken = function (id, userName) {
  return jwt.sign(
    { _id: id, userName } /* payload*/,
    process.env.APP_SECRET /* secret string */,
    {
      expiresIn: maxAge /* expire date */,
    }
  );
};

module.exports = { signup, login, logout };
