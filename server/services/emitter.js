const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');
const config = require('../utils/config');
const url = require('url');
const path = require('path');
const aes256 = require('aes256');
const crypto = require('crypto');

const wss = new WebSocket.Server({
    noServer: true,
    clientTracking: false,
    path: '/people'
});

const server = http.createServer();


function encryption(data) {
    try {
        if (data === undefined || data === null) {
            throw new Error('Invalid Data for encryption');
        }
        const cipher = aes256.createCipher(config.secret);
        const encryptedString = cipher.encrypt(data);
        return encryptedString;
    } catch (err) {
        console.log(`${err}`);
        return false;
    }
}


server.on('upgrade', function upgrade(request, socket, header) {
    const url_params = url.parse(request.url, true);
    if (url_params.query.id !== config.token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }
    wss.handleUpgrade(request, socket, header, function done(ws) {
        wss.emit('connection', ws, request);
    })
})

function returnRandom(len) {
    return Math.trunc(Math.random() * len);
}

function generatePersonObjects(data, stringLen) {
    if (JSON.stringify(data) === '{}') {
        return `No data`;
    }
    const personArr = [];
    for (let i = 0; i < stringLen; i++) {
        const rndNameIndex = returnRandom(data.names.length);
        const rndOriginIndex = returnRandom(data.cities.length);
        const rndDestIndex = returnRandom(data.cities.length);
        const person = {
            name: data.names[rndNameIndex],
            origin: data.cities[rndOriginIndex],
            destination: data.cities2[rndDestIndex]
        }
        const personJson = JSON.stringify(person);
        const hash = crypto.createHash('sha256').update(personJson).digest('hex');
        const sumCheckMessage = {
            ...JSON.parse(personJson),
            secret_key: hash
        };
        const sumCheckJson = JSON.stringify(sumCheckMessage);
        const encryptedData = encryption(sumCheckJson);
        if (encryptedData) {
            personArr.push(encryptedData);
        }
    }
    return personArr.join('|');
}
const filePath = path.resolve('data.json');
let data = {};
fs.readFile(filePath, "utf8", (err, jsonString) => {
    if (err) {
        console.log("Error reading file from disk:", err.message);
    }
    try {
        data = JSON.parse(jsonString);
        data.cities2 = [...data['cities']];
    } catch (err) {
        console.log(`Error: ${err}`);
    }
});
wss.on('connection', function connection(ws, request) {
    setInterval(() => {
        const randomStringLen = returnRandom(500);
        const string = generatePersonObjects(data, randomStringLen);
        ws.send(string);
    }, 10000);
})

server.listen(config.emitter || 8080);