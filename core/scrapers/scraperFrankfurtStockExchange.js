const logger = require('loglevel')
const {Builder, By} = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')
require('geckodriver')
const formatter = require('../utils/formatter')
const scraping = require('../../config/scraping')

module.exports = async function (ticker){
    return new Promise( (resolve, reject) => {
        (async () => {
            var driver = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless()).build()

            var response = formatter.fillPayload()

            try{
                await driver.get(scraping.frankfurtStockExchange.url + ticker)

                response.price = await driver.findElement(By.xpath(scraping.frankfurtStockExchange.xpath_price)).getText()
                response.price = formatter.insertSymbol('€', formatter.roundTwoDigit(response.price))

                response.closePrice = await driver.findElement(By.xpath(scraping.frankfurtStockExchange.xpath_closePrice)).getText()
                response.closePrice = formatter.insertSymbol('€', formatter.roundTwoDigit(response.closePrice))

                var changePercent = await driver.findElement(By.xpath(scraping.frankfurtStockExchange.xpath_changePercent)).getText()
                changePercent = changePercent.split(' EUR / ')
                response.change =  formatter.roundTwoDigit(changePercent[0])
                response.percent =  formatter.roundTwoDigit(changePercent[1]) + '%'

                formatter.sign(response)

                var maxMin = await driver.findElement(By.xpath(scraping.frankfurtStockExchange.xpath_maxMin)).getText()
                maxMin = maxMin.trim().split(' / ')
                response.max =  formatter.insertSymbol('€', formatter.roundTwoDigit(maxMin[0]))
                response.min =  formatter.insertSymbol('€', formatter.roundTwoDigit(maxMin[1]))

                logger.info('[Query] FST --> OK')
                resolve(response)
            }catch(err){
                logger.error('[Query] FST --> ERROR : ')
                logger.error(response)
                resolve(response)
            }finally{
                await driver.quit()
            }
        })()
    })
}