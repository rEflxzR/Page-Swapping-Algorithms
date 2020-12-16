const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'build')));



app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.post('/resolve', function(req, res) {
    let inputarray = req.body.inputstring.replace(/\s/g, '').split("").map((e) => {
        if(isNaN(parseInt(e))) {
            return 0
        }
        return parseInt(e)
    })
    let frames = Number(req.body.frames)

    if(req.body.algo[0]=='First In First Out') {
        const data = fifo(inputarray, frames)
        res.status(200).send(data)
    }
    else if(req.body.algo[0]=='Optimal') {
        const data = optimal(inputarray, frames)
        res.status(200).send(data)
    }
    else {
        const data = leastRecentlyUsed(inputarray, frames)
        res.status(200).send(data)
    }
})



app.listen(port, () => {
    console.log("Server Up and Running")
})


/*------------------------ PAGE REPLACEMENT FUNCTIONS ------------------------*/

function fifo(pages, size) {
    let frametable = []
    let queue = new Array(size+1)
    let loadedpages = {}
    let pagehits = 0
    let pagefaults = 0
    let baseptr = 0

    for(let page of pages) {
        if(queue[size-1]==undefined) {
            if(loadedpages[page]==undefined) {
                queue[baseptr] = page
                loadedpages[page] = true
                queue[size] = 'fault'
                pagefaults++
                baseptr = baseptr == size-1 ? 0 : baseptr+1
            }
            else {
                queue[size] = 'hit'
                pagehits++
            }
        }
        else {
            if(loadedpages[page]==undefined) {
                const swappage = queue[baseptr]
                delete loadedpages[swappage]
                queue[baseptr] = page
                loadedpages[page] = true
                queue[size] = 'fault'
                pagefaults++
                baseptr = baseptr == size-1 ? 0 : baseptr+1
            }
            else {
                queue[size] = 'hit'
                pagehits++
            }
        }
        
        frametable.push([...queue])
    }

    return {
        totalPageFaults: pagefaults,
        totalPageHits: pagehits,
        finalFramesTable: frametable
    }
}



function optimal(pages, size) {

    let frametable = []
    let queue = new Array(size+1)
    let loadedpages = {}
    let pagehits = 0
    let pagefaults = 0
    let baseptr = 0

    for(let pageindex in pages) {
        const page = pages[pageindex]
        if(queue[size-1]==undefined) {
            if(loadedpages[page]==undefined) {
                queue[baseptr] = page
                loadedpages[page] = baseptr
                pagefaults++
                baseptr++
                queue[size] = 'fault'
            }
            else {
                pagehits++
                queue[size] = 'hit'
            }
        }
        else {
            if(loadedpages[page]==undefined) {
                let newarr = pages.slice(pageindex)
                let unusedpage = null
                for(let i=0; i<size; i++) {
                    if(newarr.indexOf(queue[i])==-1) {
                        unusedpage = queue[i]
                        break
                    }
                    else {
                        unusedpage = newarr.indexOf(queue[i]) > newarr.indexOf(unusedpage) ? queue[i] : unusedpage
                    }
                }
    
                baseptr = Number(loadedpages[unusedpage])
    
                queue[baseptr] = page
                delete loadedpages[unusedpage]
                loadedpages[page] = baseptr
                pagefaults++
                queue[size] = 'fault'
            }
            else {
                pagehits++
                queue[size] = 'hit'
            }
        }

        frametable.push([...queue])
    }

    return {
        totalPageFaults: pagefaults,
        totalPageHits: pagehits,
        finalFramesTable: frametable
    }
}



function leastRecentlyUsed(pages, size) {
    let frametable = []
    let queue = new Array(size+1)
    let loadedpages = {}
    let pagehits = 0
    let pagefaults = 0
    let baseptr = 0

    for(let pageindex in pages) {
        const page = pages[pageindex]
        if(queue[size-1]==undefined) {
            if(loadedpages[page]==undefined) {
                queue[baseptr] = page
                loadedpages[page] = baseptr
                pagefaults++
                baseptr++
                queue[size] = 'fault'
            }
            else {
                pagehits++
                queue[size] = 'hit'
            }
        }
        else {
            if(loadedpages[page]==undefined) {
                let newarr = pages.slice(0, pageindex)
                let unusedpage = queue[0]
                for(let i=1; i<size; i++) {
                    unusedpage = newarr.lastIndexOf(queue[i]) < newarr.lastIndexOf(unusedpage) ? queue[i] : unusedpage
                }
    
                baseptr = Number(loadedpages[unusedpage])
    
                queue[baseptr] = page
                delete loadedpages[unusedpage]
                loadedpages[page] = baseptr
                pagefaults++
                queue[size] = 'fault'
            }
            else {
                pagehits++
                queue[size] = 'hit'
            }
        }

        frametable.push([...queue])
    }

    return {
        totalPageFaults: pagefaults,
        totalPageHits: pagehits,
        finalFramesTable: frametable
    }
}