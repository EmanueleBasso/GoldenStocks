exports.roundTwoDigit = function (num){
    if(num === '')
        return '--'
    else{
        var numFloat = parseFloat(normalize(num))

        if(isNaN(numFloat))
            return '--'
        else
            return (Math.round(((numFloat + 0.00001) * 100)) / 100).toFixed(2)
    }
}

exports.sign = function (response){
    if(response.change.charAt(0).match('/\+|\-')){
        return
    }else if(response.closePrice !== '--'){
        if(parseFloat(response.price.substring(1) - response.closePrice.substring(1)) > 0){
            response.change = '+' + response.change
            response.percent = '+' + response.percent
        }else if(parseFloat(response.price.substring(1) - response.closePrice.substring(1)) < 0){
            response.change = '-' + response.change
            response.percent = '-' + response.percent
        }
    }else{
        if(parseFloat(response.change) > 0){
            response.change = '+' + response.change
            response.percent = '+' + response.percent
        }else if(parseFloat(response.change) < 0){
            response.change = '-' + response.change
            response.percent = '-' + response.percent
        }
    }
}

exports.insertSymbol = function (simbol, val){
    if(val.includes('-'))
        return val
    else
        return (simbol + ' ' + val)
}


exports.fillPayload = function(UNSURE = 0){
    var response = {}

    response.price = 'x'
    response.closePrice = 'x'
    response.change = 'x'
    response.percent = 'x'
    response.max = 'x'
    response.min = 'x'

    if(UNSURE == 1)
        response.url = ''

    return response
}

function normalize(num){
    if(!isNaN(num))
        return num

    if(num.indexOf('.') < 0)
        return num.replace(',', '.').trim()

    num = num.replace(',', '.').trim()

    var found = false
    var newNum = ''
    for(var i = num.length - 1; i >= 0; i--){
        if((num[i] === '.') && !found)
            found = true
        else if(num[i] === '.')
            continue

        newNum = newNum.concat(num[i])
    }

    return newNum.split('').reverse().join('');
}