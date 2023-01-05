const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
require('dotenv').config();


const signup = require('./routes/signup');
const signin = require('./routes/signin');
const movie_id = require('./routes/movieInfo');
const ratings = require('./routes/ratings');


// Define app & port
var app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


// Routes
app.use('/signup', signup);
app.use('/signin', signin);
app.use('/movie_id', movie_id);
app.use('/ratings', ratings);


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})