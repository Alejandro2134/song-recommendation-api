const user = require('../components/user/network');
const mood = require('../components/mood/network');

const routes = (server) => {
    server.use('/user', user);
    server.use('/mood', mood);
}

module.exports = routes;