const express = require('express');
const app = express();

const config = require('./config');

const bodyParser = require('body-parser');
const db = require('./db');
const router = require('./network/routes');

db(config.dbUrl);

app.use(bodyParser.json());

router(app);

app.listen(3000);
console.log('App escuchando en el puerto 3000');

