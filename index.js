const express = require('express');
const bodyparser = require('body-parser');
const passport = require('passport');

// change on the basis of your stategy/configuration
const Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
    clientID: "2582501795354207",
    clientSecret: "d81ab67f46d8d9174220f321d36036a0",
    callbackURL: 'http://localhost:5000/login/facebook/return',
    },
    function(accessToken, refreshToken, profile, cb){
        return cb(null, profile);
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user);
})
passport.deserializeUser((obj, cb) => {
    cb(null, obj);
})

const ejs = require('ejs');
const port = process.env.PORT || 5000;
const app = express();

// register template engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Middleware
app.use(require('morgan')('combined'));

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));

app.use(require('express-session')({
    secret: 'lco app',
    resave: true,
    saveUninitialized: true
}))



// @route    -  Get   /
// @desc    -   A route to home page
// @access  -   PUBLIC
app.get('/', (req, res) => {
    res.render('home', {user: req.user});
})

// @route    -  Get   /login
// @desc    -   a route to login page
// @access  -   PUBLIC
app.get('/login', (req, res) => {
    res.render('login');
})

// @route    -  Get   /login/facebook
// @desc    -   a route to facebook auth
// @access  -   PUBLIC
app.get('/login/facebook', 
    passport.authenticate('facebook'));

// @route    -  Get   /login/facebook/callback
// @desc    -   a route to facebook auth
// @access  -   PUBLIC
app.get('/login/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/profile');
});

// @route    -  Get   /profile
// @desc    -   A route to profile page
// @access  -   PRIVATE
app.get('/profile', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    res.render('profile', {user :req.user});
})

app.listen(port, () => console.log(`Server is running on localhost at port: ${port}`));
