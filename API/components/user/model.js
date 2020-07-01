const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchema = new Schema ({
    spotifyId: String,
    name: String,
    image: String,
    totalPlayed: Number,
    mood: {
        type: Schema.ObjectId,
        ref: 'Mood'
    }
})

const model = mongoose.model('User', mySchema);
module.exports = model;