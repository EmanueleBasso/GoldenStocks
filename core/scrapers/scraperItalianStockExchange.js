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
                await driver.get(scraping.italianStockExchange.url_search + societyName)

                var url_society = await driver.findElement(By.xpath(scraping.italianStockExchange.url_society)).getAttribute('href')

                await driver.get(url_society)

                var url_completeData = await driver.findElement(By.xpath(scraping.italianStockExchange.url_completeData)).getAttribute('href')

                await driver.get(url_completeData)

                response.price = await driver.findElement(By.xpath(scraping.italianStockExchange.xpath_price)).getText()
                response.price = formatter.insertSymbol('€', formatter.roundTwoDigit(response.price))

                response.closePrice = await driver.findElement(By.xpath(scraping.italianStockExchange.xpath_closePrice)).getText()
                response.closePrice = formatter.insertSymbol('$', formatter.roundTwoDigit(response.closePrice))

                response.change = await driver.findElement(By.xpath(scraping.italianStockExchange.xpath_change)).getText()
                response.change = formatter.roundTwoDigit(response.change.replace(',', '.'))

                response.percent = await driver.findElement(By.xpath(scraping.italianStockExchange.xpath_percent)).getText()
                response.percent = formatter.roundTwoDigit(response.percent.replace(',', '.')) + '%'

                formatter.sign(response)

                response.max = await driver.findElement(By.xpath(scraping.italianStockExchange.xpath_max)).getText()
                response.max =  formatter.insertSymbol('$', formatter.roundTwoDigit(response.max))
                response.min = await driver.findElement(By.xpath(scraping.italianStockExchange.xpath_min)).getText()
                response.min =  formatter.insertSymbol('$', formatter.roundTwoDigit(response.min))

                response.url = url_completeData

                logger.info('[Query] IST --> OK')
                resolve(response)
            }catch(err){
                logger.error('[Query] IST --> ERROR : ')
                logger.error(response)
                resolve(response)
            }finally{
                await driver.quit()
            }
        })()
    })
}