const userModel = require("../model/user");
const validator = require("validator");
const checkMongoIdValidation = require('../utilities/functions').checkMongoIdValidation;

const addUser = async function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.confirmedPassword;
  const credit = 50;

  const newUser = new userModel({
    name,
    email,
    password,
    confirmedPassword,
    credit,
  });

  try {
    await newUser.save();
    const message = "User created with success";
    return res.status(201).json({
      message,
      status: "success",
      data: {
        user: {
          name,
          email,
          credit,
        },
      },
    });
  } catch (err) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists, please chosse a different email",
      });
    }

    console.log(error);
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })
  }
};

const getUserById = async function (req, res) {
  const userId = req.params.id;

  try {
    if(checkMongoIdValidation([userId] , 'user').error){
      let error = checkMongoIdValidation([userId], "user").error;
      return res.status(400).json({
        message: error.message,
        status: error.status,
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: `No user found for the provided id : ${userId}`,
      });
    }

    return res.status(200).json({
      data: {
        user,
      },
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })
  }
};

const deleteUserById = async function (req, res) {
  const userId = req.params.id;

  if(checkMongoIdValidation([userId] , 'user').error){
    let error = checkMongoIdValidation([userId], "user").error;
    return res.status(400).json({
      message: error.message,
      status: error.status,
    });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    await userModel.findByIdAndDelete({ _id: userId });

    return res.status(200).json({
      message: "User deleted successfully",
      status: "success",
    });
  } catch (error) {
    console.error(error.message);

    console.log(error);
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })
  }
};

const getUserByEmail = async function (req, res) {
  const userEmail = req.params.email;
  if (!validator.isEmail(userEmail) || !userEmail) {
    res.status(400).json({
      message: "Invalid Email Format",
      status: "fail",
    });
  }

  try {
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        message: "No account associated to " + userEmail,
        status: "fail",
      });
    }

    return res.status(200).json({
      data: {
        user,
      },
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })
  }
};

const deleteUserByEmail = async function (req, res) {
  const userEmail = req.params.email;

  if (!validator.isEmail(userEmail) || !userEmail) {
    res.status(400).json({
      message: "Invalid Email Format",
      status: "fail",
    });
  }

  try {
    const user = await userModel.findOneAndDelete({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        message: "No account associated to " + userEmail,
        status: "fail",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      status: "success",
    });
  } catch (error) {
    console.error(error.message);

    console.log(error);
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })
  }
};

const updateUserEmailById = async function (req, res) {
  const userId = req.params.id;
  const email = req.body.email;

  if(checkMongoIdValidation([userId] , 'user').error){
    let error = checkMongoIdValidation([userId], "user").error;
    return res.status(400).json({
      message: error.message,
      status: error.status,
    });
  }

  if (!email) {
    return res.status(400).json({
      status: "fail",
      message: "No provided data to update!",
    });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      status: "fail",
      message: "Email format is not valid",
    });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { email },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", status: "fail" });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", data: { user } });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "Email already in use, please choose another email",
        });
    }

    console.log(error);
    return res.status(500).json({
        message : 'Internal error',
        status :'fail'
    })  }
};

module.exports = {
  addUser,
  deleteUserById,
  deleteUserByEmail,
  updateUserEmailById,
  getUserById,
  getUserByEmail,
};
