const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const CONFIG = require('../config.js')
const User = require('../models/User')
const Divisions = require('../models/Divisions.js')
const router = require('express').Router()

//================  TEMP  ==================

//================  TEMP  ==================

//================= Methods ================

function serverTokenGenerate(payload, secret) {
  return jwt.sign(payload, secret, {
    expiresIn: 36 + 'h',
  })
}

async function userSearchOnLogin(userLogin) {
  try {
    let temp = await User.findOne({ login: userLogin })
    return temp ? temp : null
  } catch (e) {
    console.log(e)
  }
}

//================= Methods ================

//================= Divisions ==============
router.get('/getdivisions', async (req, res) => {
  let divisions = await Divisions.find()
  res.json({ data: divisions })
})

//================= register ===============
router.post('/register', async (req, res) => {
  if (!req.body.login || !req.body.password) {
    res.status(200).json({
      error: 'Bad user data',
    })
  }
  //   let divisions = await Divisions.find({ tittle: req.body.division })

  let registerRequest = {
    login: req.body.login,
    password: bcrypt.hashSync(req.body.password, 10),
  }

  const findUserFromBase = await userSearchOnLogin(req.body.login)
  if (findUserFromBase === null) {
    try {
      console.log(registerRequest)
      let user = await User.create(registerRequest)

      let token = serverTokenGenerate({ id: user.id }, CONFIG.SECRET)
      await User.updateOne({ _id: user._id }, { $set: { token } })
      res.status(201).json({ token })
      console.log('User created,Login-', registerRequest.login)
    } catch (e) {
      console.log(e)
    }
  } else {
    res.status(200).json({
      error: 'Login is used',
    })
    console.log(findUserFromBase.login + ' login is used')
  }
})
//================= Register ===============

//================= User Data fetch =================
router.post('/user', async (req, res) => {
  if (req.headers.auth) {
    try {
      jwt.verify(req.headers.auth.split(' ')[1], CONFIG.SECRET)
      let tokenDecoded = jwt.decode(req.headers.auth.split(' ')[1])
      let user = await User.findOne(
        { _id: tokenDecoded._id },
        { _id: 1, token: 1, name: 1, division: 1, phoneInternal: 1, permission: 1 },
      )
      res.status(200).json(user)
    } catch (err) {
      if (err.message !== 'jwt expired') {
        res.status(200).json({
          error: 'Bad bad user',
        })
      } else {
        res.status(200).json({ error: err.message })
      }
    }
  } else {
    res.status(401).json({ error: 'Bad user data' })
  }
})
//================= Login ==================
router.post('/login', async (req, res) => {
  if (!req.body.login || !req.body.password) {
    res.status(200).json({
      error: 'Неверные данные',
    })
  } else {
    console.log(req.body.login, 'login')

    let findUserFromBase = await userSearchOnLogin(req.body.login)
    if (findUserFromBase !== null) {
      if (bcrypt.compareSync(req.body.password, findUserFromBase.password)) {
        try {
          jwt.verify(findUserFromBase.token, CONFIG.SECRET)
          res.status(200).json({
            token: findUserFromBase.token,
          })
        } catch (err) {
          if (err.message === 'jwt expired') {
            let token = serverTokenGenerate({ _id: findUserFromBase._id }, CONFIG.SECRET)
            User.updateOne({ login: req.body.login }, { $set: { token } }, () => {
              res.status(200).json({ token })
            })
          } else {
            res.status(200).json({ error: err.message })
          }
        }
      } else {
        res.status(200).json({
          error: 'Неверные данные',
        })
      }
    } else {
      res.status(200).json({
        error: 'Пользователь не найден',
      })
    }
  }
})

//================= Login ==================
module.exports = router
