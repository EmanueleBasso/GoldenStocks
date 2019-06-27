const logger = require('loglevel')
const NewsAPI = require('newsapi')
const api = require('../../config/api')

const newsapi = new NewsAPI(api.newsApi.api_key)

module.exports = async function (societyName){
    return new Promise( (resolve, reject) => {
        (async () => {
            var response = []

            // Testing
            //response = readArticles()
            //logger.info('[Query] News API OK')
            
            await newsapi.v2.everything({
                q: societyName,
                language: 'en',
                sortBy: 'relevancy'
            }).then( (body) => {
                if(body.status === 'error'){
                    logger.error('[Query] News API ERROR : ')
                    logger.error(body.message)
                }else{
                    for(var i = 0; i < body.articles.length; i++){
                        var article = {}

                        article.title = body.articles[i].title
                        article.urlToImage = body.articles[i].urlToImage
                        article.description = body.articles[i].description
                        var date = (new Date(body.articles[i].publishedAt)).toUTCString()
                        article.publishedAt = date.substring(0, date.length - 7)
                        article.url = body.articles[i].url
                        article.source = body.articles[i].source.name

                        response[i] = article
                    }

                    //saveArticles(response)  // Testing

                    logger.info('[Query] News API OK')
                }
            })

            resolve(response)
        })()
    })
}

// Testing
function saveArticles(response){
    const fs = require('fs')

    fs.writeFileSync('articlesForTesting.json', JSON.stringify(response))
}

// Testing
function readArticles(){
    const fs = require('fs')

    return JSON.parse(fs.readFileSync('articlesForTesting.json'))
}