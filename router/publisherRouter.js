const express = require('express');
const router = express.Router();
const publisherController = require('../controller/api/publisherController');




router.post('/' , publisherController.addPublisher);
router.delete('/:id' ,publisherController.deletePublisherById );
router.patch('/:id' , publisherController.updatePublisherNameById);
router.get('/:id' , publisherController.getPublisherById);



module.exports = router;