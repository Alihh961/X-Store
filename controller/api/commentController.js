const commentModel = require("../../model/comment");
const checkMongoIdValidation =
  require("../../utilities/functions").checkMongoIdValidation;
const gameModel = require("../../model/game");
const mongoose = require("mongoose");
const responseHandler = require("../../utilities/responseHandler");
const userModel = require("../../model/user");

const addComment = async (req, res) => {
  try {
    const { gameId, content, upVote, downVote , userId } = req.body;

    if (upVote && downVote) {
      return responseHandler.badRequestResponse(
        res,
        "You can't vote both up and down at the same time."
      );
    }

    if(!upVote && !downVote){
        return responseHandler.badRequestResponse(
            res,
            "You must evalute the game"
          );
    }

    if (checkMongoIdValidation([gameId], "game").error) {
      return responseHandler.badRequestResponse(res, error.message);
    }

    if (!content || typeof content !== "string" || content.trim() === "") {
      return responseHandler.badRequestResponse(
        res,
        "Content must be a non-empty string."
      );
    }

    const game = await gameModel.findById(gameId);

    if (!game) {
      return responseHandler.notFoundResponse(res, "game");
    }

    const user = await userModel.findById(userId);
    if(!user){
      return responseHandler.notFoundResponse(res, "user");

    }

    const comment = new commentModel({
      game: new mongoose.Types.ObjectId(gameId),
      content,
      user : userId
    });

    await comment.save();

    if(upVote){
        game.totalUpVotes = game.totalUpVotes + 1;
    }else if(downVote){
        game.totalDownVotes = game.totalDownVotes + 1;
    }

    game.comments.push(comment._id);

    await game.save();

    return responseHandler.successResponse(
      res,
      201,
      "Created successfull",
      {comment,game}
    );
  } catch (error) {
    return responseHandler.internalErrorResponse(res, error);
  }
};

const deleteCommentById = async (req, res) => {
    
    try {
      const commentId = req.params.id;
    if (checkMongoIdValidation([commentId], "comment").error) {
      let error = checkMongoIdValidation([commentId], "comment").error;

      return responseHandler.badRequestResponse(res, error.message);
    }
    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return responseHandler.notFoundResponse(res, "comment");
    }

    const gameId = comment.game;

    const game = await gameModel.findById(gameId);

    game.comments.pull(comment.id);

    await game.save();
    await commentModel.findByIdAndDelete(comment.id);

    return responseHandler.successResponse(
      res,
      200,
      "Deleted successfully",
      {}
    );
  } catch (error) {
    return responseHandler.internalErrorResponse(res, error);
  }
};

const updateCommentById = async (req, res) => {
  try {
    const commentId = req.params.id;
    const content = req.body.content;

    if (checkMongoIdValidation([commentId], "comment").error) {
      let error = checkMongoIdValidation([commentId], "comment").error;

      return responseHandler.badRequestResponse(res, error.message);
    }

    if (!content || typeof content !== "string" || content.trim() === "") {
      return responseHandler.badRequestResponse(
        res,
        "Content must be a non-empty string."
      );
    }

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return responseHandler.notFoundResponse(res, "comment");
    }

    const updatedComment = await commentModel.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

    return responseHandler.successResponse(
      res,
      200,
      "Updated successfully",
      updatedComment
    );
  } catch (error) {
    return responseHandler.internalErrorResponse(res, error);
  }
};

const getCommentById = async (req, res) => {
  try {
    const commentId = req.params.id;

    if (checkMongoIdValidation([commentId], "comment").error) {
      let error = checkMongoIdValidation([commentId], "comment").error;

      return responseHandler.badRequestResponse(res, error.message);
    }

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return responseHandler.notFoundResponse(res, "comment");
    }

    return responseHandler.successResponse(res, 200, "Success", comment);
  } catch (error) {
    return responseHandler.internalErrorResponse(res, error);
  }
};

module.exports = {
  addComment,
  deleteCommentById,
  updateCommentById,
  getCommentById,
};
