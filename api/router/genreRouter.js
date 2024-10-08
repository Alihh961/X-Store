const express = require('express');
const router = express.Router();
const genreController = require('../controller/genreController')

router.post('/' , genreController.addGenre);



module.exports = router;