const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Divisions = require('./Divisions');
const Driver = require('./Driver');
const User = require('./User');
const division = new Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
});

module.exports = mongoose.model('Divisions', division);
