const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Register = require('./routes/auth');
const createTicket = require('./routes/createTicket');
const cors = require('cors');

const app = express();
//================ Settings ================
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//================ Services =================
const CONFIG = require('./config');

//============== Models =====================
const User = require('./models/User');

//============== Routers ====================
app.use('/auth', Register);
app.use('/api', createTicket);
app.all('*', (req, res) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, 'dist'),
    });
});

//========== Mongoose & Server runing ============
mongoose.connect(`mongodb://${CONFIG.BASE_URL}:27017/JWT`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.once('open', function () {
    app.listen(CONFIG.PORT, (err) => {
        if (err) console.log(err.name);
        console.log(`Server run on http://${CONFIG.BASE_URL}:${CONFIG.PORT}`);
    });
});
