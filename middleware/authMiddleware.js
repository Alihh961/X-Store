const responseHandler = require('../utilities/responseHandler');
const jwt = require('jsonwebtoken');

//check if the user is a superAdmin
const checkRole = (requiredRole)=>{
    return async (req, res , next)=>{

        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];;

        if(!token){
            return responseHandler.badRequestResponse(res, 'No token provided' , 401);
        }

        const decoded = jwt.verify(token, process.env.APP_SECRET);
        const user = decoded.user;
        console.log(user.roles)

        if (!user.roles || !user.roles.includes(requiredRole)) {
            return responseHandler.badRequestResponse(res, 'Unauthorized', 403);
        }


        next();


    }
}

module.exports = { checkRole}

