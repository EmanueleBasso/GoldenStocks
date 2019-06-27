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
                await driver.get(scraping.NASDAQ_OMX.url_pt1 + ticker + scraping.NASDAQ_OMX.url_pt2)
                
                response.price = await driver.findElement(By.xpath(scraping.NASDAQ_OMX.xpath_price)).getText()
                response.price = formatter.insertSymbol('$', formatter.roundTwoDigit(response.price.substring(1)))
                response.closePrice = await driver.findElement(By.xpath(scraping.NASDAQ_OMX.xpath_closePrice)).getText()
                response.closePrice = formatter.insertSymbol('$', formatter.roundTwoDigit(response.closePrice.substring(1)))

                response.change = await driver.findElement(By.xpath(scraping.NASDAQ_OMX.xpath_change)).getText()
                response.change = formatter.roundTwoDigit(response.change)
                response.percent = await driver.findElement(By.xpath(scraping.NASDAQ_OMX.xpath_percent)).getText()
                response.percent = formatter.roundTwoDigit(response.percent) + '%'

                formatter.sign(response)

                var maxMin = await driver.findElement(By.xpath(scraping.NASDAQ_OMX.xpath_maxMin)).getText()
                maxMin = maxMin.split(' / ')
                response.max =  formatter.insertSymbol('$', formatter.roundTwoDigit(maxMin[0].replace(',', '')))
                response.min =  formatter.insertSymbol('$', formatter.roundTwoDigit(maxMin[1].replace(',', '')))
               
                logger.info('[Query] NASDAQ_OMX --> OK')
                resolve(response)
            }catch(err){
                logger.error('[Query] NASDAQ_OMX --> ERROR : ')
                logger.error(response)
                resolve(response)
            }finally{
                await driver.quit()
            }
        })()
    })
}