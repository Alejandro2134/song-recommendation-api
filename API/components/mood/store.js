const Model = require('./model');

const getMood = async (moodId) => {
    const data = await Model.findById(moodId);
    return data;
}

const addMood = (mood) => {
    const myMood = new Model(mood);
    myMood.save();
}

const updateMood = (mood) => {

}

module.exports = {
    get: getMood,
    add: addMood,
    update: updateMood,
}