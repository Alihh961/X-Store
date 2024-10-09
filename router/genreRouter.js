const express = require('express');
const router = express.Router();
const genreController = require('../controller/genreController')

router.post('/' , genreController.addGenre);
router.patch('/:id' , genreController.editGenreNameOrSlugById);
router.delete('/:id', genreController.deleteGenreById);



module.exports = router;