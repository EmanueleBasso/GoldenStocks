const logger = require('loglevel')
const basicRoutes = require('./basicRoutes')
const wikipediaApi = require('./api/wikipediaApi')
const newsApi = require('./api/newsApi')

exports.functionSearchInfo = async function(req, res){
    var societyName = req.query.name
    var ticker = req.query.ticker

    if((societyName == undefined) || societyName === '' || (ticker == undefined) || ticker === ''){
        basicRoutes.functionBadRequest(req, res)
        return
    }
    
    logger.info('[Query] Print Info:')
    try{
        var payload = {}
        payload.societyName = societyName
        payload.ticker = ticker
        
        await Promise.all([wikipediaApi(societyName), newsApi(societyName)])
            .then( (responses) => {
                payload.wikipedia = responses[0]
                payload.news = responses[1]
            })
               
        logger.info('[Query] Finished')
        res.render('info', {payload})
    }catch(error){
        logger.error('[Query] ERROR')
        basicRoutes.functionInternalServerError(req, res)
    }
}