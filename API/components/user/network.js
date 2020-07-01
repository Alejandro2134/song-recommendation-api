const response = require('../../network/response');
const controller = require('./controller');

const express = require('express');
const router = express.Router();

const config = require('../../config');

router.get('/accessToken', (req, res) => {
    controller.getAccessToken(req.query.code, req.query.error)
        .then(data => {
            data 
                ? response.succes(req, res, data, 200)
                : res.redirect('https://accounts.spotify.com/authorize' +
                  '?client_id=' + config.spotifyPk +
                  '&response_type=code' +
                  '&redirect_uri=' + config.spotifyRedirect +
                  (config.spotifyScopes ? '&scope=' + config.spotifyScopes : ''))
        })
        .catch(err => {
            response.error(req, res, err, 500, err);
        })
})

router.get('/:spotifyId', (req, res) => {
    controller.getUser(req.params.spotifyId)
        .then(data => {
            response.succes(req, res, data, 200);
        })
        .catch(err => {
            response.error(req, res, 'Información invalida', 400, err);
        })
})

router.post('/', (req, res) => {
    controller.addUser(req.body.accessToken)
        .then(data => {
            response.succes(req, res, data, 201);
        })
        .catch(err => {
            response.error(req, res, 'Información invalida', 400, err);
        })
})

router.patch('/:spotifyId', (req, res) => {
    
})

module.exports = router;