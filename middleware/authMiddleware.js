const userModel = require("../model/user");
const responseHandler = require("../utilities/responseHandler");
const jwt = require("jsonwebtoken");

//check if the user is a superAdmin
const requiredRole = async (requiredRole) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader.split(" ")[1];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return responseHandler.badRequestResponse(
          res,
          "No or malformed token provided",
          401
        );
      }

      if (!token) {
        return responseHandler.badRequestResponse(
          res,
          "No token provided",
          401
        );
      }

      const decoded = jwt.verify(token, process.env.APP_SECRET);
      const userId = decoded.userId;

      const user = await userModel.findById(userId);
      if(!user){

        res.clearCookie('token', {
          httpOnly: true,  
          secure: process.env.NODE_ENV === 'production',
        });

        return responseHandler.badRequestResponse(res, "Something went wrong", 400);

      }

      if (!user.roles || !user.roles.includes(requiredRole)) {
        return responseHandler.badRequestResponse(res, "Unauthorized", 403);
      }

      next();
    } catch (error) {
      return responseHandler.badRequestResponse(
        res,
        "Invalid or expired token",
        401
      );
    }
  };
};

const requiredAdminForCrud = async (req ,res ,next)=>{
  try{

    const {method} = req;
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responseHandler.badRequestResponse(
        res,
        "No or malformed token provided",
        401
      );
    }

    if (!token) {
      return responseHandler.badRequestResponse(
        res,
        "No token provided",
        401
      );
    }

    const decoded = jwt.verify(token, process.env.APP_SECRET);
    const userId = decoded.userId;

    const user = await userModel.findById(userId);
    if(!user){

      res.clearCookie('token', {
        httpOnly: true,  
        secure: process.env.NODE_ENV === 'production',
      });

      return responseHandler.badRequestResponse(res, "Something went wrong", 400);

    }


    if ((method === 'POST' || method === 'PATCH' || method === 'DELETE') && !user.roles.includes('Admin')) {
      return responseHandler.badRequestResponse(res , 'Forbidden' , 403);
  }

  next();

  }catch(error){
    return responseHandler.internalErrorResponse(res , error);
  }
}

module.exports = { requiredRole , requiredAdminForCrud };
