var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const passport = require('passport')

const SocialsDB = require('../models/SocialsDB')
var socialsDB = new SocialsDB();

passport.serializeUser( (user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done (null, user)
})

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    socialsDB.signUp(profile.id, null, null, null, 'Google', (err, user) => {
      return done(err, user);
    });
  }
));