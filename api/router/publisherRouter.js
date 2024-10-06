const express = require('express');
const router = express.Router();
const publisherController = require('../controller/publisherController');




router.post('/' , publisherController.addPublisher);
router.delete('/:id' ,publisherController.deletePublisherById );
router.patch('/:id' , publisherController.updatePublisherNameById);



module.exports = router;