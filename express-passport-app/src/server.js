const cookieSession = require('cookie-session')
const express = require('express')
const mongoose = require("mongoose");
const path = require("node:path");
const User = require("./models/users.model");
const passport = require('passport');
require('dotenv').config();
const app = express()

const cookieEncryptionKey = [
  process.env.COOKIE_ENCRYPTION_KEY_1,
  process.env.COOKIE_ENCRYPTION_KEY_2
]

app.use(cookieSession({
  name: 'cookie-session-name',
  keys: cookieEncryptionKey,
  maxAge: 24 * 60 * 60 * 1000
}))

app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb()
    }
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb()
    }
  }
  next()
})

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')
const {checkAuthenticated, checkNotAuthenticated} = require("./middlewares/auth");

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// view engine configuration
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => {
    console.log(' mongoDB connected')
  })
  .catch(err => {
    console.log(err)
  })

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login')
})

app.post('/login', checkNotAuthenticated, (req, res, next) => {
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

app.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/')
  });

})

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup')
})

app.post('/signup', async (req, res) => {
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

app.get('/auth/google', passport.authenticate('google'))
app.get('/auth/google/callback', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login'
}))

const config = require('config')
const serverConfig = config.get('server')

const port = serverConfig.port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

