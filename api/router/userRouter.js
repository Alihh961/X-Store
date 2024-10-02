const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


router.post('/add' , userController.addUser);

router.delete('/:id' , userController.deleteUserById);


module.exports = router;
