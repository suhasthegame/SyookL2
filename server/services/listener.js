const WebSocket = require('ws');
const aes256 = require('aes256');
const crypto = require('crypto');
const Person = require('../model/person');
const config = require('../utils/config');

const wss = new WebSocket.Server({
    port: config.listener || 5050
});

const getDoc = async (date) => {
    const data = await Person.findDoc(date);
    return data;
}

wss.on('connection', function (ws, req) {
    ws.on('message', async function (msgData) {
        const data = await getDoc(msgData);
        if (data === null) {
            ws.send('No data');
        } else {
            for (let i = 0; i < data.records.length; i++) {
                ws.send(JSON.stringify(data.records[i]));
            }
        }
    })
})


const ws = new WebSocket(`ws://localhost:8080/people?id=${config.token}`);

ws.on('error', (err) => {
    console.log(err);
})

let documentsArr = [];

function decryption(data) {
    const cipher = aes256.createCipher(config.secret);
    const encryptedStrings = data.split('|');
    const arr = [];
    for (let i = 0; i < encryptedStrings.length; i++) {
        const personJson = JSON.parse(cipher.decrypt(encryptedStrings[i]));
        const person = {
            name: personJson.name,
            origin: personJson.origin,
            destination: personJson.destination
        };
        const hash = personJson['secret_key'];
        const newHash = crypto.createHash('sha256').update(JSON.stringify(person)).digest('hex');
        if (newHash === hash) {
            const personObj = new Person.SinglePerson(person);
            arr.push(personObj);
        }
    }
    return arr;
}

ws.onmessage = function (ws) {
    documentsArr.push(...decryption(ws.data));
}

setInterval(() => {
    const documents = {
        records: documentsArr
    }
    const records = new Person.TimeSeries(documents);
    records.save().then(() => {
        console.log(`Successfully Saved to DB`);
    }).catch((err) => {
        console.log(`${err}`);
    })
    documentsArr = []
}, 61000);