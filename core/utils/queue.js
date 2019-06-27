module.exports = {
    queue: [],
    maxLength: 3,
    push(ticker, societyName){
        for(var i = 0; i < this.queue.length; i++)
            if(this.queue[i].ticker === ticker)
                this.queue.splice(i, 1)

        if(this.queue.length == this.maxLength)
            this.queue.shift()

        var element = {}
        element.ticker = ticker
        element.societyName = societyName

        this.queue.push(element)
    },
    returnQueue(){
        return this.queue
    }
}