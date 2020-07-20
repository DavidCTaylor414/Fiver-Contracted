const express = require('express');
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// cookies
app.use(cookieSession({
    maxAge: 1234567,
    keys: keys.session.cookieKey
}));

// flash middleware
app.use(flash());
// create session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: keys.session.sessionKey,
  resave: false,
  saveUninitialized: false,
  cookie: { 
      maxAge: 1234567,
      secure: true 
    }
}));

app.use(passport.initialize());
app.use(passport.session());





// set up static packages
app.use(express.static('public'));

// auth routes
app.use('/auth', authRoutes);

// profile routes
app.use('/profile', profileRoutes);

// set view engine
app.set('view engine', 'ejs');

//connect to mongoDB
mongoose.connect(keys.mongoDB.dbURI, {useNewUrlParser: true, useUnifiedTopology: true});

// create home route
app.get('/', (req, res) => {
    res.render('home');
});


// create 404 route
app.get('/404', (req, res) => {
    res.render('404');
});

app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});

