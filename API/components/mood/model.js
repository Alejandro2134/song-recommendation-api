const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema ({
    _id: { type: Schema.ObjectId, required: true},
    angry: {type: Number, default: 0.0},
    nervous: {type: Number, default: 0.0},
    bored: {type: Number, default: 0.0},
    sad: {type: Number, default: 0.0},
    sleepy: {type: Number, default: 0.0},
    peaceful: {type: Number, default: 0.0},
    relaxed: {type: Number, default: 0.0},
    pleased: {type: Number, default: 0.0},
    happy: {type: Number, default: 0.0},
    excited: {type: Number, default: 0.0},
})

const model = mongoose.model('Mood', mySchema);
module.exports = model;

