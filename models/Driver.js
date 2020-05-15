const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driver = new Schema({
    car: {
        mark: {
            type: String,
        },
        number: {
            type: String,
            required: true,
        },
        trailer: {
            type: String,
        },
    },
    driver: {
        name: {
            first: {
                type: String,
            },
            middle: {
                type: String,
            },
            last: {
                type: String,
                required: true,
            },
        },
        document: {
            type: String,
            required: true,
        },
        code: {
            type: String,
        },
        organisation: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
        },
    },
});

module.exports = mongoose.model('Driver', driver);
