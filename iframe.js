function assert(condition, message) {
    if(!condition) {
        throw message || "Assertion failed!"
    }
}



function copy(origin, use) {
    // https://github.com/gnuns/allorigins
    fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(origin), {
        method: "GET",
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        credentials: "same-origin", // include, *same-origin, omit
        mode: "cors" // no-cors, *cors, same-origin
    })
    .then(function(response) {
        if(response.ok) {
            return response.text()
        }
    })
    .then(function(source) {
        return use(source)
    })
}



function relink(page) {
    var blacklist = page.querySelectorAll("[src], [href], [action]")
    console.log(page.URL)
    console.log(blacklist)
    // for(var id = 0; id < blacklist.length; id++) {
    //     var elem = blacklist[id]
    //     if(elem.getAttribute("src")) elem.setAttribute("src", reset(elem.getAttribute("src")))
    //     if(elem.getAttribute("href")) elem.setAttribute("href", reset(elem.getAttribute("href")))
    //     if(elem.getAttribute("action")) elem.setAttribute("action", reset(elem.getAttribute("action")))
    //     // url() in stylesheets?
           // references in other files like .js? should I handle these as well?
    // }
}



function fit(element) {
    if(typeof element !== "undefined" && element instanceof HTMLElement) {
        var doc = element.contentDocument || element.contentWindow.document
        var html = doc.documentElement
        var body = doc.body
        var height = Math.max(
            body.offsetHeight,
            body.scrollHeight,
            html.offsetHeight,
            html.scrollHeight,
            html.clientHeight
        )
        body.style.margin = 0
        body.style.padding = 0
        element.style.width = "100%"
        element.style.height = height + "px" // fit size to content
        element.style.border = "none"
        element.style.overflow = "hidden"
        element.setAttribute("scrolling", "no")
        element.style.border = "thin dotted red" // for debugging
    } else {
        if(!HTMLCollection.prototype.isPrototypeOf(element)) {
            element = document.getElementsByTagName("iframe")
        }
        for(var id = 0; id < element.length; id++) {
            element[id].style.height = 0 // force to change (important so some browsers)
            fit(element[id])
        }
    }
}



function observe(element, handler) {
    var listener = new MutationObserver(handler)
    listener.observe(element, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    })
    return listener // to remove listener call listener.disconnect()
}



function iframe(origin, parent) {
    var ifrm = document.createElement("iframe")
    ifrm.src = "about:blank"
    ifrm.addEventListener("load", function() {
        observe(ifrm.contentDocument, fit.bind(ifrm)) // hopefully, the mutation observer gets garbage-collected, once the element is removed from the DOM?!
        fit(ifrm)
    })
    if(origin.startsWith("http") && !origin.startsWith(window.location.origin)) {
        copy(origin, function(source) {
            ifrm.srcdoc = source
        })
    } else {
        element.src = origin
    }
    (parent || document.body).appendChild(ifrm) // native DOMParser trigger
    relink(ifrm.contentDocument)
    return ifrm
}



window.addEventListener("load", function() {
    // need to relink(ifrm.contentDocument) BEFORE it gets parsed
    // also recursevly, when link gets clicked or ressource gets included
    iframe("https://freshman.tech/custom-html5-video/")
})



// window.addEventListener("resize", fit)
// window.addEventListener("load", function() {
//     var grid = document.getElementsByClassName("gh-grid")[0]
//     iframe("template/box3d.html", grid)
//     iframe("template/grid.html", grid)
//     iframe("template/hyperlink.html", grid)
//     iframe("template/playlist.html", grid)
//     // iframe("http://designtagebuch.de", grid)
//     // iframe("https://mirelleborra.com", grid)
//     iframe("https://freshman.tech/custom-html5-video/", grid)
//     // iframe("https://www.youtube.com/channel/UC3Qk1lecHOkzYqIqeqj8uyA?view_as=subscriber", grid)
//     // iframe("https://amazon.de", grid)
// })
