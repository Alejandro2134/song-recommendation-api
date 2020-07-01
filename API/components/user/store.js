const Model = require('./model');

const addUser = (user) => {
    const myUser = new Model(user);
    myUser.save();
}

const getUser = (spotifyId) => {

    return new Promise((resolve, reject) => {

        Model.findOne({ spotifyId: spotifyId })
            .populate('mood')
            .exec((err, populated) => {
                if(err) {
                    reject(err);
                }
                resolve(populated);
            })

    })

}

module.exports = {
    add: addUser,
    get: getUser,
}