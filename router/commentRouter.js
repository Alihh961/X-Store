const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');



router.post('/' , commentController.addComment );
router.delete('/:id' , commentController.deleteCommentById);
router.patch('/:id' , commentController.updateCommentById);
router.get('/:id', commentController.getCommentById);


module.exports = router;