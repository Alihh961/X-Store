const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


router.post('/add' , userController.addUser);

router.get('/:id' , userController.getUserById);

router.delete('/:id' , userController.deleteUserById);

// router.get('/email/:email' , userController.getUserById);

router.delete('/email/:email' , userController.deleteUserByEmail);

router.patch('/:id', userController.updateUserById)


module.exports = router;
