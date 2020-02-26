const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONFIG = require('../config.js');
const User = require('../models/User');
const router = require('express').Router();

//================  TEMP  ==================

//================  TEMP  ==================

//================= Methods ================

function serverTokenGenerate(payload, secret) {
    return jwt.sign(payload, secret, {
        expiresIn: `${CONFIG.TOKEN_EXP}min`
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
//================= Methods ================

//================= register ===============
// router.post('/register', async (req, res) => {
//     let registerRequest = {
//         login: req.body.login,
//         password: bcrypt.hashSync(req.body.password, 10)
//     };
//     if (!req.body.login || req.body.password) {
//         res.status(200).json({
//             error: 'Bad user data'
//         });
//     }

//     const findUserFromBase = await userSearchOnLogin(req.body.login);
//     if (findUserFromBase === null) {
//         let token = serverTokenGenerate(req.body.login, CONFIG.SECRET);
//         registerRequest.token = token;
//         await User.create(registerRequest);

//         res.status(201).json({ token });
//         console.log('User created,Login-', registerRequest.login);
//     } else {
//         res.status(200).json({
//             error: 'Login is used'
//         });
//         console.log(findUserFromBase.login + ' login is used');
//     }
// });
//================= Register ===============

//================= User Data fetch =================
router.post('/user', async (req, res) => {
    console.log(req.url);

    if (req.body.token) {
        try {
            jwt.verify(req.body.token, CONFIG.SECRET);
            let tokenDecoded = jwt.decode(req.body.token);
            let user = await userSearchOnLogin(tokenDecoded.login);
            // console.log(user);

            res.status(200).json({
                user
            });
        } catch (err) {
            console.info(err);
            if (err.message !== 'jwt expired') {
                res.status(200).json({
                    error: 'Bad bad user'
                });
            } else {
                res.status(200).json({ error: err.message });
            }
        }
    }
});

//================= Login ==================
router.post('/login', async (req, res) => {
    let findUserFromBase = await userSearchOnLogin(req.body.login);
    // console.log(findUserFromBase);

    // let userData = {
    //     _id: findUserFromBase._id,
    //     login: findUserFromBase.login,
    //     name: findUserFromBase.name,
    //     tabNumber: findUserFromBase.tabNumber,
    //     phoneInternal: findUserFromBase.phoneInternal,
    //     division: findUserFromBase.division,
    //     divisionLabel: findUserFromBase.divisionLabel,
    //     permission: findUserFromBase.permission
    // };

    if (req.body.token) {
        try {
            jwt.verify(req.body.token, CONFIG.SECRET);
            res.status(200).json({
                token: findUserFromBase.token
            });
        } catch (err) {
            // console.log(err);
            res.status(200).json({
                error: 'Bad bad user'
            });
        }
    }
    if (!req.body.login || !req.body.password) {
        res.status(200).json({
            error: 'Неверные данные'
        });
    } else {
        if (findUserFromBase !== null) {
            if (
                bcrypt.compareSync(req.body.password, findUserFromBase.password)
            ) {
                try {
                    jwt.verify(findUserFromBase.token, CONFIG.SECRET);
                    res.status(200).json({
                        token: findUserFromBase.token
                    });
                } catch (err) {
                    let token = serverTokenGenerate(
                        { login: findUserFromBase.login },
                        CONFIG.SECRET
                    );

                    User.updateOne({ login: req.body.login }, { token }, () => {
                        res.status(200).json({ token });
                    });
                }
            } else {
                res.status(200).json({
                    error: 'Неверные данные'
                });
            }
        } else {
            res.status(200).json({
                error: 'Пользователь не найден'
            });
        }
    }
});

//================= Login ==================
module.exports = router;
