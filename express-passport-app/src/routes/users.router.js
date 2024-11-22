const express = require('express');
const usersRouter = express.Router();
const {checkAuthenticated, checkNotAuthenticated} = require("../middlewares/auth");
const passport = require("passport");
const User = require("../models/users.model");

usersRouter.post('/login', checkNotAuthenticated, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json({msg: info});
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }
      res.redirect('/')
    })
  })(req, res, next)
})

usersRouter.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/')
  });

})

usersRouter.post('/signup', async (req, res) => {
  // user 객체 생성
  const user = new User(req.body);
  try {
    // user 컬렉션 유저를 저장
    await user.save();
    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.error(error)
  }
})

usersRouter.get('/google', passport.authenticate('google'))

usersRouter.get('/google/callback', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}))

module.exports = usersRouter
