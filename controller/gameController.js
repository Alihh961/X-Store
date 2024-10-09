const userModel = require('../model/game');
const validator = require('validator');



const getGameById = async(req ,res)=>{
    const id = req.params.id;

    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/) || !id) {
          return res.status(400).json({
            message: "ID is not a valid MongoDB _id, Please Check ID",
            status: "fail",
          });
        }
    
        const user = await userModel.findById(id);
    
        if (!user) {
          return res.status(404).json({
            status: "fail",
            message: `No user found for the provided id : ${id}`,
          });
        }
    
        return res.status(200).json({
          data :{
            user
          },
          status: "success",
        });
    
      } catch (error) {
        return res.status(500).json({
          status : 'error',
          message : error.message
        });
      }

    return res.send('sexes');
}


module.exports = {getGameById}