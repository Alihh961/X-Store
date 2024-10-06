const express = require('express');
const path = require('path');
const app = express();

const userRouter = require('./api/router/userRouter');
const gameRouter = require('./api/router/gameRouter');
const publisherRouter = require('./api/router/publisherRouter')

const publicPath = path.join(__dirname , './public');

app.set('view engine' , 'ejs');
app.use(express.json()); //to add the request body sent of the api to the request body
app.use(express.static(publicPath)); // to have the access to static files in the browser


app.use(express.urlencoded({ extended: true })); // to receive data using post method



app.get('/' , (req,res)=>{
    res.send('Home Page')
});

app.use('/api/user' , userRouter);
app.use('/api/game' , gameRouter);
app.use('/api/publisher' , publisherRouter);


app.get('*' , (req,res)=>{
    res.send('No Page Found')
})





module.exports = app;