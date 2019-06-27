const logger = require('loglevel')
const {Builder, By, until} = require('selenium-webdriver')
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
                await driver.get(scraping.NYSE.url + ticker)

                response.price = await driver.wait(until.elementLocated(By.xpath(scraping.NYSE.xpath_price)), 30000).getText()
                response.price = formatter.insertSymbol('$', formatter.roundTwoDigit(response.price))
                response.closePrice = await driver.findElement(By.xpath(scraping.NYSE.xpath_closePrice)).getText()
                response.closePrice = formatter.insertSymbol('$', formatter.roundTwoDigit(response.closePrice))

                response.change = await driver.findElement(By.xpath(scraping.NYSE.xpath_change)).getText()
                response.change = formatter.roundTwoDigit(response.change)
                response.percent = await driver.findElement(By.xpath(scraping.NYSE.xpath_percent)).getText()
                response.percent = formatter.roundTwoDigit(response.percent) + '%'

                formatter.sign(response)

                response.max = await driver.findElement(By.xpath(scraping.NYSE.xpath_max)).getText()
                response.max =  formatter.insertSymbol('$', formatter.roundTwoDigit(response.max))
                response.min = await driver.findElement(By.xpath(scraping.NYSE.xpath_min)).getText()
                response.min =  formatter.insertSymbol('$', formatter.roundTwoDigit(response.min))

                logger.info('[Query] NYSE --> OK')
                resolve(response)
            }catch(err){
                logger.error('[Query] NYSE --> ERROR : ')
                logger.error(response)
                resolve(response)
            }finally{
                await driver.quit()
            }
        })()
    })
}