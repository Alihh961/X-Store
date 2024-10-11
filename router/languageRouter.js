const express = require('express');
const router = express.Router();
const languageController = require('../controller/languageController');
const uploadFlagImageService = require('../service/uploadFlagImageService');

router.post('/' , uploadFlagImageService , languageController.addLanguage);
router.get('/:id' , languageController.getLanguageById);
router.patch('/:id' , uploadFlagImageService, languageController.updateLanguageById);
router.delete('/:id', languageController.removeLanguageById);



module.exports = router;