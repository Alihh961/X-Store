const commentModel = require('../model/comment');
const checkMongoIdValidation = require('../helpers/functions').checkMongoIdValidation;
const gameModel = require('../model/game');
const mongoose = require('mongoose');





const addComment = async(req, res)=>{
    const {
        gameId,
        content
    } = req.body;


    if(checkMongoIdValidation([gameId] , 'game').error){
        return res.status(400).json({
            message : error.message,
            status :error.status
        })
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({
          message: 'Content must be a non-empty string.',
          status: 'fail',
        });
      }

    try{

   
    const game = await gameModel.findById(gameId);

    if(!game){
        return res.status(404).json({
            message : `No game founded for the id: ${gameId}`,
            status :'fail'
        })
    }

    const comment = new commentModel({
        game : new mongoose.Types.ObjectId(gameId),
        content,
    });

    await comment.save();
    game.comments.push(comment._id);

    await game.save();

    return res.status(201).json({
        message : "Comment created successfully",
        status : 'success',
        data : {
            comment
        }
    })
}catch(error){
    return res.status(400).json({
        message : error.message,
        status : 'fail'
    })
}

    
}


const deleteCommentById = async(req ,res)=>{
    const commentId = req.params.id;

    if(checkMongoIdValidation([commentId] , 'comment').error){
        let error = checkMongoIdValidation([commentId] , 'comment').error;

        return res.status(400).json({
            message : error.message,
            status : error.status
        })
    }

    try{
        const comment = await commentModel.findById(commentId);

        console.log(comment)
        if(!comment){
            return res.status(404).json({
                message : `No comment found for the id: ${commentId}`,
                status: 'fail'
            })
        }
    
        const gameId = comment.game;
    
        const game = await gameModel.findById(gameId);

        game.comments.pull(comment.id);
        
        await game.save();
        await commentModel.findByIdAndDelete(comment.id);
    
    
        return res.status(200).json({
            message : 'Comment deleted successfully',
            status : 'success'
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            message : 'Internal error',
            status :'fail'
        })
    }

}


module.exports = { addComment , deleteCommentById }