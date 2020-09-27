function assert(condition, message) {
    if(!condition) {
        throw message || "Assertion failed!"
    }
}



function copy(api, origin, use) {
    var uri = api + encodeURIComponent(origin) // https://github.com/gnuns/allorigins
    fetch(uri)
    .then(function(response) {
        if(response.ok) {
            return response.json()
        }
    })
    .then(function(data) {
        use(data.contents)
    })
}



function proxy(origin, use) {
    /*
    var reset = function(path) {
        var host = new URL(origin)
        var link = path // convert absolute to relative
            .replace(host.origin, "")
            .replace("//" + host.hostname, "")
        if(!link.startsWith("#") // self-reference link without page reloading
        && !link.startsWith("//") // http(s): anchronym
        && !link.startsWith("http") // including http: and https:
        && !link.startsWith("mailto:")
        && !link.startsWith("callto:")
        && !link.startsWith("tel:")
        && !link.startsWith("fax:")
        && !link.startsWith("maps:")
        && !link.startsWith("geo:")
        && !link.startsWith("fb:")
        && !link.startsWith("twitter:")) {
            var lol = "https://api.allorigins.win/raw?url=" + host.origin + link // convert relative to absolute with proxy prefix
            // var lol = "https://api.allorigins.win/get?callback=use&url=" + host.origin + link // convert relative to absolute with proxy prefix
            console.log(path, link, lol)
            return lol
        }
        return path
        // return "https://api.allorigins.win/raw?url=" + new URL(path, host.origin)
    }
    */
    var host = new URL(origin)
    var url = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    function reset(query) {
        return query.replace(url, function(path) {
            return "https://api.allorigins.win/raw?url=" + new URL(path, host.origin)
        })
    }
    copy("https://api.allorigins.win/get?url=", origin, function(source) {
        use(reset(source))
        /*
        var parser = new DOMParser()
        var doc = parser.parseFromString(source, "text/html")
        var blacklist = doc.querySelectorAll("[src], [href], [action]")
        for(var id = 0; id < blacklist.length; id++) {
            var elem = blacklist[id]
            if(elem.getAttribute("src")) elem.setAttribute("src", reset(elem.getAttribute("src")))
            if(elem.getAttribute("href")) elem.setAttribute("href", reset(elem.getAttribute("href")))
            if(elem.getAttribute("action")) elem.setAttribute("action", reset(elem.getAttribute("action")))
            // url() in stylesheets?
        }
        use(doc.documentElement.outerHTML)
        */
    })
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
    var element = document.createElement("iframe")
    element.src = "about:blank"

    element.addEventListener("load", function() {
        var doc = element.contentDocument || element.contentWindow.document
        observe(doc.body, fit.bind(element))
        fit(element)
    })

    if(origin.startsWith("http") && !origin.startsWith(window.location.origin)) {
        proxy(origin, function(source) {
            element.srcdoc = source
        })
    } else {
        element.src = origin
    }

    (parent || document.body).appendChild(element)
    return element
}



window.addEventListener("load", function() {
    proxy("https://freshman.tech/custom-html5-video/", function(source) {
        var frm = document.createElement("iframe")
        frm.addEventListener("load", fit.bind(frm))
        frm.src = "about:blank"
        frm.srcdoc = source
        document.body.appendChild(frm)
    })
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
