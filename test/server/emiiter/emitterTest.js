const rewire = require('rewire');
const chai = require('chai');
const should = chai.should();
const path = require('path');

const emitter = rewire(path.resolve('server\\services', 'emitter.js'));

const encryption = emitter.__get__('encryption');
const generatePerson = emitter.__get__('generatePersonObjects');

describe('Emitter Encryption function check', function () {
    it('Should throw an error if we try to encrypt null or undefined',
        function () {
            encryption().should.equal(false);
        })
    it('Should return an aes Encrypted String', function () {
        encryption('Soldier').should.be.a('string');
    })
    it('Should throw an error if Persons data is empty', function () {
        generatePerson({}).should.be.equal(`No data`);
    });
    it('Should return encrypted Strings', function () {
        const data = {
            names: ['AJ'],
            cities: ['Georgia'],
            cities2: ['NY']
        }
        generatePerson(data, 1).should.be.a('string');
    })
})