const express = require('express');
const path = require('path');
const app = express();

const userRouter = require('./router/userRouter');
const gameRouter = require('./router/gameRouter');
const publisherRouter = require('./router/publisherRouter');
const genreRouter = require('./router/genreRouter');

const authController = require('./controller/authController');

const publicPath = path.join(__dirname , './public');

app.set('view engine' , 'ejs');
app.use(express.json()); //to add the request body sent of the api to the request body
app.use(express.static(publicPath)); // to have the access to static files in the browser


app.use(express.urlencoded({ extended: true })); // to receive data using post method



app.get('/' , (req,res)=>{
    res.send('Home Page')
});

app.use('/user' , userRouter);
app.use('/game' , gameRouter);
app.use('/publisher' , publisherRouter);
app.use('/genre' , genreRouter);

app.post('/register' , authController.signup);
app.post('/login' , authController.login );
app.post('/logout' , authController.logout);




app.get('*' , (req,res)=>{
    res.send('No Page Found')
})





module.exports = app;