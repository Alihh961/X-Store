const express = require('express');
const path = require('path');
const app = express();


const apiRouter = require('./router/apiRouter');


const authController = require('./controller/authController');

const authMiddleware = require('./middleware/authMiddleware');

const publicPath = path.join(__dirname , './public');

app.set('view engine' , 'ejs');
app.use(express.json()); //to add the request body sent of the api to the request body
app.use(express.static(publicPath)); // to have the access to static files in the browser


app.use(express.urlencoded({ extended: true })); // to receive data using post method



app.get('/' , (req,res)=>{
    res.send('Home Page')
});

app.use('/api' , apiRouter);

app.post('/register' , authController.signup);
app.post('/login' , authController.login );
app.post('/logout' , authController.logout);

const mid = require('./middleware/authMiddleware');
app.post('/test',(req,res)=>{
    return res.json(req.headers.cookie);
})

app.all('*' , (req,res)=>{
    res.send('No Page Found')
})





module.exports = app;