const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user");
const responseHandler = require("../utilities/responseHandler");


//check this controller

const maxAge = 365 * 24 * 60 * 60 ;
const signup = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;
    const credit = 50;
    const emailExists = await userModel.findOne({ email });
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if (!name) {
      return responseHandler.badRequestResponse(res, "Name is required");
    }
    if (!email) {
      return responseHandler.badRequestResponse(res, "Email is required");
    }

    if (!password || !confirmedPassword) {
      return responseHandler.badRequestResponse(
        res,
        "Both password and confirmed password are required"
      );
    }

    if (emailExists) {
      return responseHandler.badRequestResponse(
        res,
        `An account with the email address '${email}' already exists. Please use a different email or try logging in.`
      );
    }

    if (password !== confirmedPassword) {
      return responseHandler.badRequestResponse(
        res,
        "Password and confirmed password must be equal"
      );
    }

    if (!passwordRegex.test(password)) {
      return responseHandler.badRequestResponse(res, "Invalid password format");
    }

    const user = new userModel({
      name,
      email,
      password,
      confirmedPassword,
      credit,
    });
    await user.save();

    user.password = undefined;
    const token = signToken(user.id , maxAge);

    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 365 * 24 * 60 * 60 * 1000 //it should be in milliseconds since maxAge in res.cookie() expects the value in milliseconds
    });

    return responseHandler.successResponse(
      res,
      201,
      "User added successfully",
      { user, token }
    );
  } catch (error) {
    return responseHandler.internalErrorResponse(res, error);
  }
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    var user = await userModel.findOne({ email }).select("+password");

    if (!email || !password) {
      return responseHandler.badRequestResponse(
        res,
        "Email and Password are required"
      );
    }

    if (!user || !(await user.comparingPasswordInDB(password, user.password))) {
      return responseHandler.badRequestResponse(res, "Invalid credentials");
    }

    // to deselect the password
    user = await userModel.findOne({ email });

    const token = signToken(user.id , maxAge);

    res.cookie("token", token, { httpOnly: false, maxAge: maxAge * 1000 }); // * 1000 because in the cookie it is treated in milliseconds

    return responseHandler.successResponse(res, 200, "Success", {
      user,
      token,
    });
  } catch (error) {
    return responseHandler.internalErrorResponse(res, error.message);
  }
};

const logout = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });

  res.redirect("/");
};

const signToken = function (userId,  maxAge = '1h') {
  return jwt.sign(
    {
      userId,
    },
    /* payload*/ process.env.APP_SECRET,
    {
      expiresIn: maxAge,
    }
  );
};



module.exports = { signup, login, logout };
