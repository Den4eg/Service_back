const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Divisions = require('./Divisions.js')

const user = new Schema({
  login: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  token: {
    default: '',
    type: String,
  },
  name: { first: String, last: String, middle: String },
  tabNumber: {
    type: Number,
    set: (d) => parseInt(d),
  },
  phoneInternal: Number,
  division: {
    type: mongoose.Types.ObjectId,
    ref: Divisions,
  },
  permission: {
    default: 0,
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('User', user)
