const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONFIG = require('../config.js');
const User = require('../models/User');
const Journal = require('../models/Journal');
const Driver = require('../models/Driver');
const router = require('express').Router();

router.post('/create', (req, res) => {
    console.log(req.body);
});

module.exports = router;
