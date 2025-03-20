const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const dbconfig = require('./config/dbConfig');

const server = require('./app');

const PORT = process.env.PORT_NUMBER || 5000;

server.listen(PORT, () => {
    console.log('Listening requests on Port:' + PORT)
});