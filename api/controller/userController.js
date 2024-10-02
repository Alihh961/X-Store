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
    console.log(req);
    console.log(name, email, password, confirmedPassword);

    await newUser.save();
    const message = "User created with success";
    res.status(201).json({
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

    res.status(400).json({
      error : {
        message : err.message,

      },
      status : "fail"
    });
  }
};

module.exports = { addUser };
