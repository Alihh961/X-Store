const validator = require("validator");
const path = require("path");
const fs = require("fs");
const languageModel = require("../model/language");
const responseHandler = require("../utilities/responseHandler");

const userModel = require("../model/game");
const gameModel = require("../model/game");
const publisherModel = require("../model/publisher");
const genreModel = require("../model/genre");
const commentModel = require("../model/comment");

const checkMongoIdValidation =
  require("../utilities/functions").checkMongoIdValidation;

const getGameById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!checkMongoIdValidation(id, "game", res)) return;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: `No user found for the provided id : ${id}`,
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

const addGame = async (req, res) => {
  try {
    const {
      name,
      price,
      publishedAt,
      description,
      slug,
      languagesId,
      genreId,
      publisherId,
    } = req.body;
    const comments = {};

    if (checkMongoIdValidation(languagesId, "language").error) {
      let error = checkMongoIdValidation(languagesId, "language").error;
      return res.status(400).json({
        message: error.message,
        status: error.status,
      });
    }
    if (checkMongoIdValidation([publisherId], "publisher").error) {
      let error = checkMongoIdValidation([publisherId], "publisher").error;
      return res.status(400).json({
        message: error.message,
        status: error.status,
      });
    }
    if (checkMongoIdValidation([genreId], "genre").error) {
      let error = checkMongoIdValidation([genreId], "genre").error;
      return res.status(400).json({
        message: error.message,
        status: error.status,
      });
    }

    const imageCover = `${req.files.imageCover[0].filename}`; /* the new filename from multer*/
    const imageLogo = `${req.files.imageLogo[0].filename}`;

    const coverFilePath = path.join(
      __dirname,
      "../public/uploads/images/game/",
      imageCover
    );
    const logoFilePath = path.join(
      __dirname,
      "../public/uploads/images/game/",
      imageLogo
    );

    const gameExists =
      (await gameModel.findOne({ name })) ||
      (await gameModel.findOne({ slug }));

    if (gameExists) {
      fs.unlinkSync(coverFilePath, (error) => {
        console.log("Error while delete the cover image: " + coverFilePath);
      });
      fs.unlinkSync(logoFilePath, (error) => {
        console.log("Error while deleting logo " + logoFilePath);
      });
      return res.status(400).json({
        message: "Name and slug must be unique",
        status: "fail",
      });
    }

    let languages = [];

    for (const id of languagesId) {
      const language = await languageModel.findById(id);
      if (language) languages.push(language);
    }

    if (!languages) {
      return res.status(404).json({
        message: `No languages found for the ids provided`,
        stats: "fail",
      });
    }

    const publisher = await publisherModel.findById(publisherId);
    if (!publisher) {
      return res.status(404).json({
        message: `No publisher found for the id: ${publisherId}`,
        stats: "fail",
      });
    }

    const genre = await genreModel.findById(genreId);
    if (!genre) {
      return res.status(404).json({
        message: `No genre found for the id: ${genreId}`,
        stats: "fail",
      });
    }

    const game = new gameModel({
      name,
      price,
      publishedAt,
      description,
      imageCover,
      imageLogo,
      slug,
      languages,
      genre,
      publisher,
    });

    await game.save();

    return res.status(201).json({
      message: "Game created successcully",
      data: {
        game,
      },
      status: "success",
    });
  } catch (error) {
    console.log(error);
    fs.unlinkSync(coverFilePath, (error) => {
      console.log("Error while delete the cover image: " + coverFilePath);
    });
    fs.unlinkSync(logoFilePath, (error) => {
      console.log("Error while deleting logo " + logoFilePath);
    });

    return res.status(500).json({
      message: "Internal error",
      status: "fail",
    });
  }
};

const updateGameById = async (req, res) => {
    try {
      const gameId = req.params.id;
      const changes = req.body;

      if ("languages" in changes) {
        var languages = changes.languages;
        delete changes.languages;

        if (!Array.isArray(languages)) {
          languages = [languages];
        }
      }

      if (checkMongoIdValidation([gameId], "game").error) {
        let error = checkMongoIdValidation([gameId], "game").error;
        return res.status(400).json({
          message: error.message,
          status: error.status,
        });
      }

      if (checkMongoIdValidation(languages, "language").error) {
        let error = checkMongoIdValidation(languages, "language").error;
        return res.status(400).json({
          message: error.message,
          status: error.status,
        });
      }

      const game = await gameModel.findById(gameId);

      if (!game) {
        return res.status(404).json({
          message: "No game for the provided id " + gameId,
          status: "fail",
        });
      }

      // delete any language id that doesnt relate to any existant document in database then update languages
      let validLanguagesId = [];
      for (const languageId of languages) {
        const language = await languageModel.findById(languageId);

        // If the language exists, keep the languageId in the array
        if (language) {
          validLanguagesId.push(languageId);
        }
      }
      if(validLanguagesId.length > 0){
        for(const languageId of validLanguagesId ){
          console.log(languageId)
          if(!game.languages.includes(languageId)){
            game.languages.push(languageId)

          }
          
        }
        await game.save();
     
      }

      // to insure that images wont be updated here , another method will takecare of changing images
      if ("imageCover" in changes) {
        delete changes.imageCover;
      }
      if ("imageLogo" in changes) {
        delete changes.imageLogo;
      }

      const updatedGame = await gameModel.findByIdAndUpdate(gameId, changes, {
        new: true,
      });

      return res.status(201).json({
        message: "Game updated successfully",
        data: {
          updatedGame,
        },
        status: "success",
      });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Name and slug are unique",
        status: "fail",
      });
    }
    return res.status(500).json({
      message: "Internal error",
      status: "fail",
    });
  }
};

const deleteGameById = async (req, res) => {
  try {
    const gameId = req.params.id;

    if (checkMongoIdValidation([gameId], "game").error) {
      let error = checkMongoIdValidation([gameId], "game").error;
      return responseHandler.badRequestResponse(res, error.message);
    }

    const game = await gameModel.findById(gameId);

    if (!game) {
      return responseHandler.notFoundResponse(res, "game");
    }

    await gameModel.findByIdAndDelete(gameId);

    await commentModel.deleteMany({ game: gameId });

    const coverPath = path.join(
      __dirname,
      `../public/uploads/images/game/${game.imageCover}`
    );
    const logoPath = path.join(
      __dirname,
      `../public/uploads/images/game/${game.imageLogo}`
    );

    fs.unlink(coverPath, (err) => {
      if (err) {
        console.error("Error while deleting file:", err);
      }
    });

    fs.unlink(logoPath, (err) => {
      if (err) {
        console.error("Error while deleting file:", err);
      }
    });

    return responseHandler.successResponse(
      res,
      200,
      "Game deleted successfully",
      {}
    );
  } catch (error) {
    return responseHandler.internalErrorResponse(res, error);
  }
};

module.exports = { getGameById, addGame, updateGameById, deleteGameById };
