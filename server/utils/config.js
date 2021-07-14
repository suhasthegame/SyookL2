// const Log = require('../utils/logging');
require('dotenv').config({
    path: __dirname + '\\..\\..\\.env'
})



module.exports = {
    port: process.env.PORT,
    emitter: process.env.EMITTER_PORT,
    listener: process.env.LISTENER_PORT,
    token: process.env.TOKEN,
    secret: process.env.CIPHER_SECRET
}