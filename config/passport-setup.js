/*
DONE() 
passport.use new LinkedInStrategy sends the keys, scope, and callback url
to the linkedin servers. linkedin checks the info then sends back an 
authorization code in the url which passoprt conventiently returns to 
us in our callback function which we define as profile. we use the callback
to create new or authenticate existing users. once done, we call done()
THIS IS WHERE IT GETS A BIT CONFUSING done() actually then passes the user to 
our serialization function before finally redirecting to the callback url

UPDATE INFO ON SESSIONS AND COOKIES
*/

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');
const sleep = require('sleep-promise');

/*
passport.use(new GoogleStrategy({}));
*/

//cookie serialization

passport.serializeUser(function(user, done) {
    console.log('serializing')
    return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('deserializing')
    User.findById(id, function(err, user) {
    return done(err, user.id);
  });
});



passport.use(new LinkedInStrategy({
    clientID: keys.linkedin.clientID,
    clientSecret: keys.linkedin.clientSecret,
    callbackURL: "http://127.0.0.1:3000/auth/linkedin/redirect",
    scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
  },function(accessToken, refreshToken, profile, done) {
    console.log('checking if user already exists');
    // check if user already exists in our own db
    User.findOne({linkedInID: profile.id}).then( (currentUser) => {
        if(currentUser){
            // already have this user
            console.log('already have this user');
            return done(null, currentUser)
        } else {
            // if not, create user in our db
            console.log('attempting to create new user')
            new User({
                linkedInID: profile.id,
                username: profile.displayName,
                photos: profile.photos,
                _raw: profile._raw,
                emails: profile.emails,
                _emailJson: profile._emailJson.elements

            }).save().then((newUser) => {
                console.log('created new user');
                return done(null, newUser)
            });
        }
    })
  }));



