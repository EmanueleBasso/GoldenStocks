const express = require('express')
const logger = require('loglevel')
const config = require('./config/essential')
const basicRoutes = require('./core/basicRoutes')
const searchSociety = require('./core/searchSociety')
const recentSearchs = require('./core/recentSearchs')
const searchInfo = require('./core/searchInfo')

const app = express()

logger.setLevel('TRACE', false)

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get(config.basepath, basicRoutes.functionIndex)
app.get(config.basepath + '/about', basicRoutes.functionAbout)
app.get(config.basepath + '/terms', basicRoutes.functionTerms)
app.get(config.basepath + '/search', searchSociety.functionSearchSociety)
app.get(config.basepath + '/recent', recentSearchs.functionRecentSearchs)
app.get(config.basepath + '/info', searchInfo.functionSearchInfo)

app.use(basicRoutes.functionInvalidPath)      // Default path

app.listen(config.port, config.host, () => logger.info('[System] App Golden Stocks deployed at: http://' + config.host + ':' + config.port + config.basepath))