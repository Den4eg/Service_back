const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Divisions = require('./Divisions')

const user = new Schema(
    {
        login: {
            required: true,
            type: String
        },
        password: {
            required: true,
            type: String
        },
        token: {
            default: '',
            type: String
        },
        name: String,
        tabNumber: String,
        phoneInternal: Number,
        division: {
            type: mongoose.Types.ObjectId,
            ref: Divisions
        },
        permission: {
            default: 0,
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', user);
