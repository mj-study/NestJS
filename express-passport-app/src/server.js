const express = require('express')
const mongoose = require("mongoose");
const path = require("node:path");
require('dotenv').config();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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

app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/signup', (req, res) => {
  res.render('signup')
})

const port = 4000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

