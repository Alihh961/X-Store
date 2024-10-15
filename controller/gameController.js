const userModel = require("../model/game");
const validator = require("validator");
const gameModel = require("../model/game");
const path = require("path");
const fs = require("fs");
const languageModel = require("../model/language");
const publisherModel = require("../model/publisher");
const genreModel = require("../model/genre");

const checkMongoIdValidation =
  require("../helpers/functions").checkMongoIdValidation;

const getGameById = async (req, res) => {
  const id = req.params.id;

  try {
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

  return res.send("sexes");
};

const addGame = async (req, res) => {
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
    (await gameModel.findOne({ name })) || (await gameModel.findOne({ slug }));

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

  try {
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
      publisher
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
    fs.unlinkSync(coverFilePath, (error) => {
      console.log("Error while delete the cover image: " + coverFilePath);
    });
    fs.unlinkSync(logoFilePath, (error) => {
      console.log("Error while deleting logo " + logoFilePath);
    });

    return res.status(400).json({
      message: error.message,
      status: "fail",
    });
  }
};

const updateGameById = async (req, res) => {
  const gameId = req.params.id;
  const changes = req.body;

  if (checkMongoIdValidation([gameId], "game").error) {
    let error = checkMongoIdValidation([gameId], "game").error;
    return res.status(400).json({
      message: error.message,
      status: error.status,
    });
  }

  try {
    const game = await gameModel.findById(gameId);
    if (!game) {
      return res.status(404).json({
        message: "No game for the provided id " + gameId,
        status: "fail",
      });
    }

    // to insure that images wont be change here , another method will takecare of changing images
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
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Name and slug are unique",
        status: "fail",
      });
    }
    return res.status(400).json({
      message: error.message,
      status: "fail",
    });
  }
};

const deleteGameById = async (req, res) => {
  const gameId = req.params.id;

  if(checkMongoIdValidation([gameId] , 'game').error){
    let error = checkMongoIdValidation([gameId], "game").error;
    return res.status(400).json({
      message: error.message,
      status: error.status,
    });
  }
  const game = await gameModel.findById(gameId);

  if (!game) {
    return res.status(404).json({
      message: `No game related to the id ${gameId} was found`,
      status: "fail",
    });
  }

  try {
    await gameModel.findByIdAndDelete(gameId);

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

    return res.status(200).json({
      message: "Game Deleted successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      status: "fail",
    });
  }
};

module.exports = { getGameById, addGame, updateGameById, deleteGameById };
