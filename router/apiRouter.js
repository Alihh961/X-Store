const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const userRouter = require('./userRouter');
const gameRouter = require('./gameRouter');
const publisherRouter = require('./publisherRouter');
const genreRouter = require('./genreRouter');
const languageRouter = require('./languageRouter');
const commentRouter = require('./commentRouter');


router.use('/user' ,authMiddleware.requiredAdminForCrud , userRouter);
router.use('/game' , authMiddleware.requiredAdminForCrud , gameRouter);
router.use('/publisher', authMiddleware.requiredAdminForCrud , publisherRouter );
router.use('/genre' , authMiddleware.requiredAdminForCrud , genreRouter);
router.use('/language' , authMiddleware.requiredAdminForCrud , languageRouter);
router.use('/comment' , authMiddleware.requiredAdminForCrud , commentRouter );


module.exports =  router ;