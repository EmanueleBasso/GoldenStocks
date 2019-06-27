const logger = require('loglevel')
const request = require('request')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser
const api = require('../../config/api')
const cache = require('../wikipediaCache/cache')

module.exports = async function (societyName){
    return new Promise( (resolve, reject) => {
        (async () => {
            var response = {}

            response.industry = ''
            response.headquarters = ''
            response.founded = ''
            response.type = ''
            response.link = ''
            response.description = ''

            var found = await cache.searchInCache(societyName, response)

            if(found){
                logger.info('[Query] Wikipedia OK (found in cache)')
                resolve(response)
                return
            }
                
            request(api.wikipedia.search_pt1 + societyName + api.wikipedia.search_pt2, { json: true }, async (err, res, body) => {
                try{
                    if(err)
                        throw 'error'

                    var pageId = body.query.search[0].pageid

                    request(api.wikipedia.page + pageId, { json: true }, async (err, res, body) => {
                        try{
                            if(err)
                                throw 'error'
            
                            var doc = new dom().parseFromString(body.parse.text['*'])
    
                            var total_row = xpath.select(api.wikipedia.number_row_info, doc)
    
                            for(var i = 0; i < total_row.length; i++){
                                var th = xpath.select(api.wikipedia.info_row_pt1 + i + api.wikipedia.info_row_th_pt2, doc)
    
                                if(th.length != 0){
                                    if(th[0].data === 'Industry')
                                        response.industry = extractIndustry(i, doc)
                                    else if(th[0].data === 'Headquarters')
                                        response.headquarters = extractHeadquarters(i, doc)
                                    else if(th[0].data === 'Founded')
                                        response.founded = extractValue(i, doc)
                                    else if((th[0].data === 'Type') || (th[0].data === 'Type of business')) 
                                        response.type = extractValue(i, doc)
                                    else if(th[0].data === 'Website')
                                        response.link = extractWebsite(i, doc)                       
                                }
                            }
    
                            response.description = extractDescription(doc)
    
                            logger.info('[Query] Wikipedia OK')
                            await cache.updateCache(societyName, response)
                            resolve(response)
                        }catch(err){
                            logger.error('[Query] Wikipedia ERROR : ')
                            logger.error(response)
                            resolve(response)
                        }
                    })
                }catch(err){
                    logger.error('[Query] Wikipedia ERROR : ')
                    logger.error('Page not found!')
                    resolve(response)
                }
            })
        })()
    })
}

function extractIndustry(i, doc){
    var td = xpath.select(api.wikipedia.info_row_pt1 + i + api.wikipedia.info_row_td_pt2, doc)

    var text = ''

    for(var j = 0; j < td.length; j++){
        if(td[j].data !== '\n')
            text = text + td[j].data + ', '
    }

    text = text.substring(0, text.length - 2)

    text = eliminateCite(text)

    return text
}

function extractHeadquarters(i, doc){
    var td = xpath.select(api.wikipedia.info_row_pt1 + i + api.wikipedia.info_row_td_pt2, doc)

    var text = ''

    for(var j = 0; j < td.length; j++){
        text = text + td[j].data

        if(td[j].data === ')')
            text = text + ' - '
    }

    if(text.substring(text.length - 3) === ' - ')
        text = text.substring(0, text.length - 3)

    text = eliminateCite(text)

    return text
}

function extractWebsite(i, doc){
    var td = xpath.select(api.wikipedia.info_row_pt1 + i + api.wikipedia.info_row_td_pt2, doc)

    var text = ''

    var firstLink = true
    for(var j = 0; j < td.length; j++){
        if(!td[j].data.startsWith('.')){
            if(!firstLink){
                text = text + ', '
            }else{
                firstLink = false
            }
        }

        text = text + td[j].data
    }

    text = eliminateCite(text)

    return text
}

function extractValue(i, doc){
    var td = xpath.select(api.wikipedia.info_row_pt1 + i + api.wikipedia.info_row_td_pt2, doc)

    var text = ''

    for(var j = 0; j < td.length; j++)
        text = text + td[j].data

    text = eliminateCite(text)

    return text
}

function extractDescription(doc){
    var allPTag = xpath.select(api.wikipedia.description_row, doc)

    var text = ''

    var exit = false
    for(var i = 2; (i < allPTag.length) && !exit; i++){
        var allTextDescription = xpath.select(api.wikipedia.description_pt1 + (i + 1) + api.wikipedia.description_pt2, doc)
        
        var tmp = ''
        for(var j = 0; j < allTextDescription.length; j++)
            tmp = tmp + allTextDescription[j].data

        tmp = eliminateCite(tmp)

        text = text + tmp

        if(allPTag[i].nextSibling.tagName == undefined)
            exit = true
    }

    return text
}

function eliminateCite(text){
    var regex = /\[[0-9]+\]/gm

    return text.replace(regex, '')
}