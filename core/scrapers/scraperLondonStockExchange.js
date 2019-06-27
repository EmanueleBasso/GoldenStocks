const logger = require('loglevel')
const {Builder, By} = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')
require('geckodriver')
const formatter = require('../utils/formatter')
const scraping = require('../../config/scraping')

module.exports = async function (societyName){
    return new Promise( (resolve, reject) => {
        (async () => {
            var driver = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless()).build()

            var response = formatter.fillPayload(UNSURE = 1)

            try{
                await driver.get(scraping.londonStockExchange.url_search + societyName)

                var url_society = await driver.findElement(By.xpath(scraping.londonStockExchange.url_society)).getAttribute('href')

                await driver.get(url_society)

                response.price = await driver.findElement(By.xpath(scraping.londonStockExchange.xpath_price)).getText()
                response.price = formatter.insertSymbol('$', formatter.roundTwoDigit(response.price))

                response.closePrice = await driver.findElement(By.xpath(scraping.londonStockExchange.xpath_closePrice)).getText()
                response.closePrice = formatter.insertSymbol('$', formatter.roundTwoDigit(response.closePrice.split(' ')[0]))

                response.change = await driver.findElement(By.xpath(scraping.londonStockExchange.xpath_change)).getText()
                response.change = formatter.roundTwoDigit(response.change.replace('(', '').replace(')', '').trim())
                response.percent = await driver.findElement(By.xpath(scraping.londonStockExchange.xpath_percent)).getText()
                response.percent = formatter.roundTwoDigit(response.percent) + '%'

                formatter.sign(response)

                response.max = await driver.findElement(By.xpath(scraping.londonStockExchange.xpath_max)).getText()
                response.max =  formatter.insertSymbol('$', formatter.roundTwoDigit(response.max))
                response.min = await driver.findElement(By.xpath(scraping.londonStockExchange.xpath_min)).getText()
                response.min =  formatter.insertSymbol('$', formatter.roundTwoDigit(response.min))

                response.url = url_society

                logger.info('[Query] LST --> OK')
                resolve(response)
            }catch(err){
                logger.error('[Query] LST --> ERROR : ')
                logger.error(response)
                resolve(response)
            }finally{
                await driver.quit()
            }
        })()
    })
}