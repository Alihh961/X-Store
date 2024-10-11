const express = require('express');
const router = express.Router();
const gameController = require("../controller/gameController");
const uploadGameImagesService = require('../service/uploadGameImagesService');


router.get('/:id' , gameController.getGameById);
router.post('/' , uploadGameImagesService ,  gameController.addGame);
router.patch('/:id' , gameController.updateGameById);
router.delete('/:id' , gameController.deleteGameById);




module.exports = router;
