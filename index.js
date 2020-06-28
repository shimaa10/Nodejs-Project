const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport')

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Body Parser Middle ware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// db config

const db = require('./config/keys');

// connect to mongdb

mongoose
.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(() => console.log("mongoose connected"))
.catch(err =>console.log(err));

// passport midddelware

app.use(passport.initialize());

// passport config

require('./config/passport')(passport);



// Use Routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);


const port = process.env.PORT || 5000;

app.listen(port , () => console.log(`Server is running on port ${port}`));