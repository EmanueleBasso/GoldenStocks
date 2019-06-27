const logger = require('loglevel')
const basicRoutes = require('./basicRoutes')
const stocksPrices = require('./stocksPrices')
const scraperYahooFinance = require('./scrapers/scraperYahooFinance')
const queue = require('./utils/queue.js')

exports.functionSearchSociety = async function(req, res){
    var societyName = req.query.name
    var ticker = req.query.ticker

    if((societyName == undefined) || societyName === ''){
        var error = {}
        error.tickerNotFound = 'YES'
    
        res.render('index', {error})
        return
    }

    if((ticker == undefined) || ticker === ''){
        scraperYahooFinance(societyName)
            .then( async (ticker) => {
                if(ticker === ''){
                    logger.info('[Query] Search society: ' + societyName + '  -->  Ticker not found!')

                    var error = {}
                    error.tickerNotFound = 'YES'
                
                    res.render('index', {error})
                }else{
                    logger.info('[Query] Search society: ' + societyName + '  -->  Ticker found: ' + ticker)

                    var payload = {}
                    payload.societyName = societyName
                    payload.ticker = ticker

                    await stocksPrices(payload)

                    queue.push(ticker, societyName)

                    logger.info('[Query] Finished')
                    res.render('main', {payload})
                }
            })
            .catch( (error) => {
                logger.error('[Query] ERROR')
                basicRoutes.functionInternalServerError(req, res)
            })
    }else{
        logger.info('[Query] Search society: ' + societyName + '  -->  Ticker: ' + ticker)

        var payload = {}
        payload.societyName = societyName
        payload.ticker = ticker

        await stocksPrices(payload)

        queue.push(ticker, societyName)

        logger.info('[Query] Finished')
        res.render('main', {payload})
    }
}