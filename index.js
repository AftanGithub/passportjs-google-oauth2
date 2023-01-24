const express = require ('express');
const passport = require ('passport');
const path = require ('path');
var session = require ('express-session');
const app = express ();
require ('./auth');
app.use (express.json ());
app.use (express.static (path.join (__dirname, 'client')));

app.use (
  session ({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
  })
);
app.use (passport.initialize ());
app.use (passport.session ());
app.get ('/', (req, res) => {
  res.sendFile ('index.html');
});
function isLoggedIn (req, res, next) {
  req.user ? next () : res.sendStatus (401);
}
app.get (
  '/auth/google',
  passport.authenticate ('google', {
    scope: ['email', 'profile'],
  })
);

app.get (
  '/auth/google/callback',
  passport.authenticate ('google', {
    successRedirect: '/auth/protected',
    failureRedirect: '/auth/google/failure',
  })
);

app.get ('/auth/protected', isLoggedIn, (req, res) => {
  let name = req.user.displayName;
  res.send (`Hello ${name}!`);
});
app.get ('/auth/google/failure', (req, res) => {
  res.sendStatus ('Something went wrong!');
});

app.get ('/auth/logout', (req, res) => {
  req.session.destroy ();
  res.send ('See you again!');
});

app.listen (5000, () => {
  console.log ('listening on port:5000');
});
