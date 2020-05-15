const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Divisions = require('./Divisions');
const Driver = require('./Driver');
const User = require('./User');
const journal = new Schema({
    division: {
        type: Schema.Types.ObjectId,
        ref: Divisions,
    },
    date: {
        recDate: {
            created: {
                type: Date,
                required: true,
                default: Date.now,
            },
            modified: [
                {
                    date: {
                        type: Date,
                        required: true,
                        default: Date.now(),
                    },
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: User,
                    },
                },
            ],
            localTime: {
                incoming: {
                    date:{
                        type: String,
                        required: true
                    },
                    time:{
                        type: String,
                        required: true
                    }

                },
                outgoing: {
                    date:{type: String},
                    time:{type: String}

                },
            },
        },
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: Driver,
    },
    status: {
        type: Boolean,
        required: true,
    },
    operation: {
        type: Boolean,
        required: true,
    },
    documents: {
        type: Array,
    },
    notes: {
        type: String,
    },
});

module.exports = mongoose.model('Journal', journal);
