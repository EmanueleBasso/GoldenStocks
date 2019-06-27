const logger = require('loglevel')
const Page = require('./Page')

exports.searchInCache = async function(societyName, response){
    var found = false

    await Page.find({societyName: societyName}, async (error, page) => {
        if(error){
            logger.error('[Query] Failed to read the database!')
            return
        }

        if(page.length != 0){
            var actualDate = (new Date()).getTime()
            var pageDate = Date.parse(page[0]._id.getTimestamp())

            if((actualDate - pageDate) <= 86400000){
                response.industry = page[0].industry
                response.headquarters = page[0].headquarters
                response.founded = page[0].founded
                response.type = page[0].type
                response.link = page[0].link
                response.description = page[0].description

                found = true
            }else{
                await page[0].remove()
            }
        }
    })
    
    return found
}

exports.updateCache = async function(societyName, response){
    var page = new Page({
        societyName: societyName,
        industry: response.industry,
        headquarters: response.headquarters,
        founded: response.founded,
        type: response.type,
        link: response.link,
        description: response.description
    })

    await page.save()
}