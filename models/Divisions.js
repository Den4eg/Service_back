const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');
const division = new Schema({
    tittle: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
});

module.exports = mongoose.model('Divisions', division);
