function assert(condition, message) {
    if(!condition) throw message || "Assertion failed!"
}



function script(url) {
    return new Promise(function(resolve, reject) {
        var duplicate = document.querySelectorAll("[src=\"" + url + "\"]")
        if(duplicate.length > 0) reject("Script from origin '" + url + "' has already been included!", duplicate[0])
        var elem = document.createElement("script")
        elem.type = "text/javascript"
        elem.src = url
        elem.async = false
        elem.addEventListener("load", resolve.bind(null, elem))
        document.head.appendChild(elem)
    })
}



async function copy(origin) {
    // https://github.com/gnuns/allorigins
    var response = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(origin), {
        method: "GET",
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        credentials: "same-origin", // include, *same-origin, omit
        mode: "cors" // no-cors, *cors, same-origin
    })
    if(response.ok) return await response.text()
}



function relink(source) {
    // var blacklist = page.querySelectorAll("[src], [href], [action]")
    // console.log(page.URL)
    // console.log(blacklist)
    // for(var id = 0; id < blacklist.length; id++) {
    //     var elem = blacklist[id]
    //     if(elem.getAttribute("src")) elem.setAttribute("src", reset(elem.getAttribute("src")))
    //     if(elem.getAttribute("href")) elem.setAttribute("href", reset(elem.getAttribute("href")))
    //     if(elem.getAttribute("action")) elem.setAttribute("action", reset(elem.getAttribute("action")))
    //     // url() in stylesheets?
           // references in other files like .js? should I handle these as well?
    // }
    return source
}



function fit(element) {
    if(typeof element !== "undefined" && element instanceof HTMLElement) {
        var doc = element.contentDocument
        var body = doc.body
        var scroller = doc.scrollingElement || doc.documentElement
        var height = Math.max(
            scroller.offsetHeight,
            scroller.clientHeight,
            scroller.scrollHeight,
            body.offsetHeight,
            body.scrollHeight
        )
        body.style.margin = 0
        body.style.padding = 0
        element.style.width = "100%"
        element.style.height = 0 // safari fix
        element.style.height = height + "px"
        element.setAttribute("frameborder", "0")
        element.style.border = "none"
        element.setAttribute("scrolling", "no")
        element.style.overflow = "hidden"
    } else {
        if(!HTMLCollection.prototype.isPrototypeOf(element)) {
            element = document.getElementsByTagName("iframe")
        }
        for(var id = 0; id < element.length; id++) {
            element[id].style.height = 0 // safari fix
            fit(element[id])
        }
    }
}



function watch(element, run) {
    var listener = new MutationObserver(run)
    listener.observe(element, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    })
    return listener // to remove listener call listener.disconnect()
}



async function iframe(origin, parent) {
    var ifrm = document.createElement("iframe")
    ifrm.src = "about:blank"
    ifrm.addEventListener("load", function() {
        setTimeout(fit.bind(ifrm), 10) // safari fix (https://css-tricks.com/snippets/jquery/fit-iframe-to-content)
        watch(ifrm.contentDocument.body, fit.bind(ifrm)) // in case scripts or css change the page structure
        fit(ifrm)
    })
    if(origin.startsWith("http") && !origin.startsWith(window.location.origin)) {
        var source = await copy(origin)
        ifrm.srcdoc = relink(source)
    } else {
        ifrm.src = origin
    }
    (parent || document.body).appendChild(ifrm) // leverage native DOMParser
    return ifrm
}



async function init() {
    var grid = document.getElementsByClassName("gh-grid")[0]
    
    await iframe("/template/box3d.html", grid)
    await iframe("/template/grid.html", grid)
    await iframe("/template/hyperlink.html", grid)
    await iframe("/template/playlist.html", grid)
    
    // await iframe("https://freshman.tech/custom-html5-video/")
    
    // iframe("http://designtagebuch.de", grid)
    // iframe("https://mirelleborra.com", grid)
    // iframe("https://www.youtube.com/channel/UC3Qk1lecHOkzYqIqeqj8uyA?view_as=subscriber", grid)
    // iframe("https://amazon.de", grid)
    
    // need to relink(ifrm.contentDocument) BEFORE it gets parsed
    // also recursevly, when link gets clicked or ressource gets included

    console.log("done loading iframes")
}



window.addEventListener("resize", fit)
window.addEventListener("load", init)
