const logger = require('loglevel')
const mongoose = require('mongoose')
const config = require('../../config/db') 

const pageSchema = new mongoose.Schema({
    societyName: {
        type: String,
        lowercase: true,
        required: true
    },
    industry: String,
    headquarters: String,
    founded: String,
    type: String,
    link: String,
    description: String
})

const option = {
    user: config.user,
    pass: config.password,
    dbName: config.db_name,
    useNewUrlParser: true
}

mongoose.connect('mongodb://' + config.host + ':' + config.port, option, (error) => {
    if(error) 
        logger.error('Connection to database refused!')
})

module.exports = mongoose.model('Page', pageSchema, config.collection_name)