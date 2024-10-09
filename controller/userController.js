const userModel = require("../model/user");
const validator = require("validator");

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

    return res.status(400).json({
      error: {
        message: err.message,
      },
      status: "fail",
    });
  }
};

const getUserById = async function (req, res) {
  const userId = req.params.id;

  try {
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !userId) {
      return res.status(400).json({
        message: "ID is not a valid MongoDB _id, Please Check ID",
        status: "fail",
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
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteUserById = async function (req, res) {
  const userId = req.params.id;

  if (!userId.match(/^[0-9a-fA-F]{24}$/) || !userId) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
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

    return res.status(500).json({
      message: error.message,
      status: "error",
    });
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
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
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

    return res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

const updateUserEmailById = async function (req, res) {
  const userId = req.params.id;
  const email = req.body.email;

  if (!userId.match(/^[0-9a-fA-F]{24}$/) || !userId) {
    return res.status(400).json({
      message: "ID is not a valid MongoDB _id, Please Check ID",
      status: "fail",
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

    return res.status(400).json({ message: "Error updating user" });
  }
};

module.exports = {
  addUser,
  deleteUserById,
  deleteUserByEmail,
  updateUserEmailById,
  getUserById,
  getUserByEmail,
};
