const express = require('express');
const router = express.Router();
const genreController = require('../controller/api/genreController')

router.post('/' , genreController.addGenre);
router.patch('/:id' , genreController.updateGenreById);
router.delete('/:id', genreController.deleteGenreById);
router.get('/:id' , genreController.getGenreById);



module.exports = router;