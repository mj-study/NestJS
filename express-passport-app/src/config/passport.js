const passport = require('passport');
const User = require("../models/users.model");
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

// req.login (user)
passport.serializeUser((user, done) => {
  done(null, user.id);
})

// client => session => request
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error)
  }
})

// passport local 전략 사용
const localStrategy = new LocalStrategy({usernameField: 'email', passwordField: 'password'},
  async (email, password, done) => {
    try {

      const user = await User.findOne({email: email.toLocaleString()});

      // if (err) {
      //   return done(err);
      // }

      if (!user) {
        return done(null, false, {msg: `Email ${email} not found`})
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }

        if (isMatch) {
          return done(null, user)
        }

        return done(null, false, {msg: 'Invalid email or password'})
      })

    } catch (error) {
      console.error(error)
      return done(error)
    }
  });

passport.use('local', localStrategy)

const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CB_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {

  try {
    const existingUser = await User.findOne({googleId: profile.id});

    if (existingUser) {
      return done(null, existingUser)
    }

    const user = new User({
      email: profile.emails[0].value,
      googleId: profile.id
    });
    const savedUser = await user.save();
    return done(null, savedUser);

  } catch (err) {
    console.log('error: ', err);
    return done(err);
  }

})
passport.use('google', googleStrategy)
