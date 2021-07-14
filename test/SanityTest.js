const should = require('chai').should();
require('./server/emiiter/emitterTest');
require('./server/model/personTest')
const mongoose = require('mongoose');
const config = {
    dbname: 'test'
}

mongoose.connect(`mongodb://localhost:27017/${config.dbname}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then(() => {
    console.log("Test DB connection successfull")
}).catch((error) => {
    console.log(error);
});


describe('Sanity Check for Inititializing Mocha tests', function () {
    it('Should pass if mocha runs.', function () {
        String(true).should.be.equal('true');
    })
})