const userModel = require("../../model/user");

const addUser = async function (req, res, next) {
  const userModel = require("../../model/user");

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
    return res.status(400).json({
      error: {
        message: err.message,
      },
      status: "fail",
    });
  }
};

const deleteUserById = async function (req, res, next) {
  const userId = req.params.id;

  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
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

module.exports = { addUser, deleteUserById };
