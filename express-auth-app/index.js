const express = require('express');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express();
const secretText = 'secretKey'
const refreshSecretText = 'refreshKey'

let refreshTokens = []
const posts = [
  {
    username: 'John',
    title: 'post1'
  },
  {
    username: 'king',
    title: 'post2'
  }
]

app.use(express.json())
app.use(cookieParser())

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = {name: username}

  // jwt 이용 토큰 생성
  // 유효기간 추가
  const accessToken = jwt.sign(user, secretText, {expiresIn: '30s'});

  // jwt 이용해서 refreshToken 생성
  const refreshToken = jwt.sign(user, refreshSecretText, {expiresIn: '1d'});
  refreshTokens.push(refreshToken)

  // refreshToken은 쿠키에 넣기
  // name은 jwt대신 refreshToken 이라 해도됨 자유롭게
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000 * 24
  })

  res.json({accessToken: accessToken})
})

app.get('/posts', authMiddleware, (req, res) => {
  res.json(posts)
})

app.get('/refresh', (req, res) => {
  // get cookies
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(403);

  const refreshToken = cookies.jwt;
  // refreshToken DB에 있는지 확인
  if (!refreshToken.includes(refreshTokens)) return res.sendStatus(403);

  // 유효성 검증
  jwt.verify(refreshToken, refreshSecretText, (err, user) => {
    if (err) return res.sendStatus(403);
    // accessToken 생성
    const accessToken = jwt.sign({name: user.name}, secretText, {expiresIn: '30s'});
    res.json({accessToken: accessToken})
  })
})

function authMiddleware(req, res, next) {
  // 토큰을 request headers에서 가져오기
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  // 토큰 유효성 검증
  jwt.verify(token, secretText, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}

const port = 4000;
app.listen(port, () => {
  console.log('listening on port ' + port);
})
