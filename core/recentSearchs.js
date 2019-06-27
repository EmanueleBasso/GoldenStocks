const logger = require('loglevel')
const basicRoutes = require('./basicRoutes')
const stocksPrices = require('./stocksPrices')
const queue = require('./utils/queue.js')

exports.functionRecentSearchs = async function(req, res){
    var recentSearchs = queue.returnQueue()
    var payload = []

    logger.info('[Query] Print Recent Searchs:')
    try{
        for(var i = 0; i < recentSearchs.length; i++){
            var obj = {}

            obj.societyName = recentSearchs[i].societyName
            obj.ticker = recentSearchs[i].ticker
        
            await stocksPrices(obj)

            payload[i] = obj
        }

        logger.info('[Query] Finished')
        res.render('recentSearchs', {payload})
    }catch(error){
        logger.error('[Query] ERROR')
        basicRoutes.functionInternalServerError(req, res)
    }
}