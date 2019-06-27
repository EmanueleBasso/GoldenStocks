const {Builder, By} = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')
require('geckodriver')
const scraping = require('../../config/scraping')

module.exports = async function (societyName){
    //return 'AMZN'           // Testing

    return new Promise( (resolve, reject) => {
        (async () => {
            var driver = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless()).build()

            try{
                await driver.get(scraping.yahooFinance.url + societyName)
                await driver.findElement(By.xpath(scraping.yahooFinance.xpath_button)).click()

                var ticker
                try{
                    ticker = await driver.findElement(By.xpath(scraping.yahooFinance.xpath_ticker)).getText()
                }catch(err){
                    ticker = ''
                }
   
                resolve(ticker)
            }catch(err){
                reject('error')
            }finally{
                await driver.quit()
            }
        })()
    })
}