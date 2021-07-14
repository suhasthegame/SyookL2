const mongoose = require('mongoose');
// const config = require('../utils/config')
const config = {
    dbname: 'RTDB'
}

mongoose.connect(`mongodb://localhost:27017/${config.dbname}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then(() => {
    console.log("Connection to database is successfull")
}).catch((error) => {
    console.log(error);
});