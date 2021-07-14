const chai = require('chai');
const should = chai.should();
const Person = require('../../../server/model/person');


describe('Testing insert operations of the Person Schema', function () {
    it('Should return an error when trying to insert only name', async function () {
        const person = new Person.SinglePerson({
            name: 'Aj'
        });
        try {
            const result = await person.save();
        } catch (err) {
            err.message.should.contain('SinglePerson validation failed');
        }
    })
    it('Should return an error when trying to insert only origin', async function () {
        const person = new Person.SinglePerson({
            origin: 'Georgia'
        });
        try {
            const result = await person.save();
        } catch (err) {
            err.message.should.contain('SinglePerson validation failed');
        }
    })
    it('Should return an error when trying to insert only destination', async function () {
        const person = new Person.SinglePerson({
            destination: 'Orlando'
        });
        try {
            const result = await person.save();
        } catch (err) {
            err.message.should.contain('SinglePerson validation failed');
        }
    })
});

describe('Testing Insert operations of the Timeseries Schema', function () {
    beforeEach(async function () {
        await Person.TimeSeries.deleteMany({});
    })
    const person = new Person.SinglePerson({
        name: 'Aj',
        origin: 'Georgia',
        destination: 'Orlando'
    });
    it('Should throw an Error because records field is missing ', async function () {
        const record = new Person.TimeSeries({
            nord: 'VPN'
        });
        try {
            console.log(await record.save());
        } catch (err) {
            err.message.should.contain('Records array empty')
        }
    })
    it('Should Successfully insert a document into the Timeseries db', async function () {
        const document = {
            records: [person]
        }
        const record = new Person.TimeSeries(document);
        try {
            const res = await record.save();
            res.should.be.an('object');
        } catch (err) {
            throw new Error(err);
        }
    })

})