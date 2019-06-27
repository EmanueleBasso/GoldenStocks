$(document).ready(function() {
  var tr = $('tr')

  for(i = 1; i < tr.length; i++){
    var td = tr.eq(i).find('td')
        
    for(j = 1; j < td.length; j++){
      if(td.eq(j).text() === 'x'){
        td.eq(j).text('')
        td.eq(j).append('<span class="fa fa-close" />')
      }else if(td.eq(j).text() === '--'){
        td.eq(j).text('')
        td.eq(j).append('<span class="fa fa-minus" />')
      }
    }
    
    if(isNaN(td.eq(2).text())){
      // nothing
    }else if(parseFloat(td.eq(2).text()) > 0){
      td.eq(2).addClass('green')
      td.eq(3).addClass('green')
    }else if(parseFloat(td.eq(2).text()) < 0){
      td.eq(2).addClass('red')
      td.eq(3).addClass('red')
    }

    if(td.length == 8)
      if(td.eq(7).find('a').attr('href') === '')
        td.eq(7).find('a').removeAttr('href')
  }
})