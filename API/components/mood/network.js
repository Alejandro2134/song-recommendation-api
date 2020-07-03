const express = require('express');
const router = express.Router();

const controller = require('./controller');

const response = require('../../network/response');

router.get('/:moodId', (req, res) => {
    controller.getMood(req.params.moodId)
        .then(data => {
            response.succes(req, res, data, 200);
        })
        .catch(err => {
            response.error(req, res, 'Información invalida', 400, err);
        })
})

router.post('/', (req, res) => {
    controller.addMood(req.body.moodId, req.body.accessToken)
        .then(data => {
            response.succes(req, res, data, 201);
        })
        .catch(err => {
            response.error(req, res, 'Información invalida', 400, err);
        })
})

router.patch('/', (req, res) => {
    controller.updateMood(req.body.accessToken, req.body.userId)
        .then(data => {
            response.succes(req, res, data, 200);
        })
        .catch(err => {
            response.error(req, res, 'Error interno', 500, err);
        })
})

module.exports = router;