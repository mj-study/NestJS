const cookieSession = require('cookie-session')
const express = require('express')
const mongoose = require("mongoose");
const path = require("node:path");
require('dotenv').config();
const config = require('config')
const serverConfig = config.get('server')
require('./config/passport')
const passport = require('passport');

const User = require("./models/users.model");
const mainRouter = require("./routes/main.router");
const usersRouter = require("./routes/users.router");
const {checkAuthenticated, checkNotAuthenticated} = require("./middlewares/auth");

// 서버 및 key variable
const port = serverConfig.port
const app = express()
const cookieEncryptionKey = [
  process.env.COOKIE_ENCRYPTION_KEY1,
  process.env.COOKIE_ENCRYPTION_KEY2
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

app.use('/', mainRouter)
app.use('/auth', usersRouter)
app.use('/static', express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
