const express = require('express');
const router = express.Router();
const publisherController = require('../controller/publisherController');




router.post('/' , publisherController.addPublisher);
router.delete('/:id' ,publisherController.deletePublisherById );
router.patch('/:id' , publisherController.updatePublisherNameById);
router.get('/:id' , publisherController.getPublisherById);
router.get('/name/:name' , publisherController.getPublisherByName );



module.exports = router;