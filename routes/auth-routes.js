const router = require('express').Router();
const passport = require('passport');
const flash = require('connect-flash');


// set homepage
router.get('/', (req, res) => {
  res.send('auth homepage.')
});

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});

// linkedin auth
router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/redirect', function(req, res, next) {
    passport.authenticate('linkedin', function(err, user, info) {
        // check for errors
        if (err) { return next(err); }

        // make sure there is a user returned
        if (!user) { return res.render('login'); }

        //log the user in
        req.logIn(user, function(err) {
        if (err) { return next(err); }

        console.log(user)
        console.log('we successfully passed the user to the redirect page')

        //res.send(user);

        // PROFILE-ROUTES NOT GETTING PASSED USER   
        return res.redirect('/profile/');
      });
    })(req, res, next);
  });


module.exports = router;