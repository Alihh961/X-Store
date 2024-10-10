const express = require('express');
const router = express.Router();
const languageController = require('../controller/languageController')

router.post('/' , languageController.addLanguage);
router.get('/:id' , languageController.getLanguageById);
router.patch('/:id' , languageController.updateLanguageById);
router.delete('/:id', languageController.removeLanguageById);



module.exports = router;