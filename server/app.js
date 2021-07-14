const express = require('express');
const app = express();
require("./db/conn");
require('../server/services/emitter')
require('../server/services/listener')
const config = require('./utils/config');
const port = config.port || 3000;

app.use(express.static('client'));

app.listen(port, () => {
    console.log('Strarted Successfully');
})