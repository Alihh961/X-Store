const express = require('express');
const router = express.Router();
const languageController = require('../controller/languageController');
const uploadLanguageFlag = require('../service/uploadImageService');

router.post('/' , uploadLanguageFlag , languageController.addLanguage);
router.get('/:id' , languageController.getLanguageById);
router.patch('/:id' , languageController.updateLanguageById);
router.delete('/:id', languageController.removeLanguageById);



module.exports = router;