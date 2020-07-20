const router = require('express').Router()

const authCheck = (req, res, next) => {
    
    if(!req.user){
        // user not logged in
        res.redirect('/auth/login');
    } else {
        //logged in
        next();
    }
}
            // req.user is undefined
router.get('/', /*authCheck,*/ (req, res) => {
    res.render('profile');
    console.log(req.isAuthenticated());
    //console.log(req.session)
});

module.exports = router;
