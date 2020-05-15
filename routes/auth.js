const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONFIG = require('../config.js');
const User = require('../models/User');
const Divisions = require('../models/Divisions');
const router = require('express').Router();

//================  TEMP  ==================

//================  TEMP  ==================

//================= Methods ================

function serverTokenGenerate(payload, secret) {
    return jwt.sign(payload, secret, {
        expiresIn: `${CONFIG.TOKEN_EXP}min`,
    });
}

async function userSearchOnLogin(userLogin) {
    try {
        let temp = await User.findOne({ login: userLogin });
        return temp ? temp : null;
    } catch (e) {
        console.log(e);
    }
}

async function serchUserOnId(id) {
    try {
        let temp = await User.findOne({ _id: id });
        return temp ? temp : null;
    } catch (e) {
        console.log(e);
    }
}
//================= Methods ================

//================= Divisions ==============
router.post('/getdivisions', async (req,res)=>{
    let divisions = await Divisions.find()
    res.json({data:divisions})
})

//================= register ===============
router.post('/register', async (req, res) => {

    if (!req.body.login || req.body.password || req.body.division) {
        res.status(200).json({
            error: 'Bad user data'
        });
    }
    let registerRequest = {
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, 10),
        division: await Divisions.find({"location": req.body.division})._id
     };

    const findUserFromBase = await userSearchOnLogin(req.body.login);
    if (findUserFromBase === null) {
        let user = await User.create(registerRequest);
        let token = serverTokenGenerate(user._id, CONFIG.SECRET);
        await User.update({_id: user._id},{"$set":{token}});


        res.status(201).json({ token });
        console.log('User created,Login-', registerRequest.login);
    } else {
        res.status(200).json({
            error: 'Login is used'
        });
        console.log(findUserFromBase.login + ' login is used');
    }
});
//================= Register ===============

//================= User Data fetch =================
router.post('/user', async (req, res) => {
    if (req.headers.auth) {
        try {
            jwt.verify(req.headers.auth.split(' ')[1], CONFIG.SECRET);
            let tokenDecoded = jwt.decode(req.headers.auth.split(' ')[1]);
            let user = await serchUserOnId(tokenDecoded._id);
            res.status(200).json({ user });
        } catch (err) {
            if (err.message !== 'jwt expired') {
                res.status(200).json({
                    error: 'Bad bad user',
                });
            } else {
                res.status(200).json({ error: err.message });
            }
        }
    } else {
        res.status(401).json({ error: 'Bad user data' });
    }
});

//================= Login ==================
router.post('/login', async (req, res) => {
    if (!req.body.login || !req.body.password) {
        res.status(200).json({
            error: 'Неверные данные',
        });
    } else {
        let findUserFromBase = await userSearchOnLogin(req.body.login);
        if (findUserFromBase !== null) {
            if (
                bcrypt.compareSync(req.body.password, findUserFromBase.password)
            ) {
                try {
                    jwt.verify(findUserFromBase.token, CONFIG.SECRET);
                    res.status(200).json({
                        token: findUserFromBase.token,
                    });
                } catch (err) {
                    let token = serverTokenGenerate(
                        { _id: findUserFromBase._id },
                        CONFIG.SECRET
                    );

                    User.updateOne({ login: req.body.login }, { token }, () => {
                        res.status(200).json({ token });
                    });
                }
            } else {
                res.status(200).json({
                    error: 'Неверные данные',
                });
            }
        } else {
            res.status(200).json({
                error: 'Пользователь не найден',
            });
        }
    }
});

//================= Login ==================
module.exports = router;
