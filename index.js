const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('./config/keys').mongoURI;
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
// connecting to mongoDB
mongoose.connect(db)
        .then(()=>console.log('Successfully connected to db'))
        .catch(err=>console.log(err))

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

// defining routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.port || 5000;
app.listen(port, ()=>console.log( `server running on port ${port}`));