const scarperNASDAQ_OMX = require('./scrapers/scraperNASDAQ_OMX')
const scraperNewYorkStockMarket = require('./scrapers/scraperNewYorkStockMarket')
const scraperFrankfurtStockExchange = require('./scrapers/scraperFrankfurtStockExchange')
const scraperLondonStockExchange = require('./scrapers/scraperLondonStockExchange')
const scraperItalianStockExchange = require('./scrapers/scraperItalianStockExchange')

module.exports = async function (payload){
    societyName = payload.societyName
    ticker = payload.ticker

    //return fillPayloadTest(payload) // Testing

    /*fillPayloadTest(payload) // Testing
    return await Promise.all([scraperLondonStockExchange(societyName)])
        .then( (responses) => {})
    */
    
    
    await Promise.all([scarperNASDAQ_OMX(ticker), scraperNewYorkStockMarket(ticker), scraperFrankfurtStockExchange(ticker), 
        scraperLondonStockExchange(societyName), scraperItalianStockExchange(societyName)])
        .then( (responses) => {
            payload.data = responses
        })
}

// Testing
function fillPayloadTest(payload){
    payload.data = []
    
    for(var i = 0; i < 5; i++){
        var obj = {}

        obj.price = 'fake'
        obj.closePrice = 'fake'
        obj.change = 'fake'
        obj.percent = 'fake'
        obj.max = 'fake'
        obj.min = 'fake'

        if((i == 3) || (i == 4))
            obj.url = ''

        payload.data[i] = obj
    }
}