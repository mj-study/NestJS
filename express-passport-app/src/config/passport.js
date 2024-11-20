const passport = require('passport');
const User = require("../models/users.model");
const LocalStrategy = require('passport-local').Strategy

// req.login (user)
passport.serializeUser((user, done) => {
  done(null, user.id);
})

// client => session => request
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(error) {
    done(error)
  }
})

// passport local 전략 사용
passport.use('local', new LocalStrategy({usernameField: 'email', passwordField: 'password'},
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
  }))
