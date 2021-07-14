const mongoose = require('mongoose');
const validator = require('validator');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true
    }
})

const timeSeriesSchema = new mongoose.Schema({
    records: {
        type: [personSchema],
        required: true,
        validate(value) {
            if (!value.length) {
                throw new Error('Records array empty');
            }
        }
    }
}, {
    timestamps: true
});

const SinglePerson = new mongoose.model('SinglePerson', personSchema);

const TimeSeries = new mongoose.model('TimeSeries', timeSeriesSchema);


const findDoc = async (date) => {
    const records = await TimeSeries.findOne({
        createdAt: {
            $lte: date
        }
    })
    return records;
}


module.exports = {
    TimeSeries,
    SinglePerson,
    findDoc
};