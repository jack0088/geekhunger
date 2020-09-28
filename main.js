function assert(condition, message) {
    if(!condition) throw message || "Assertion failed!"
}



function script(url) {
    return new Promise(function(resolve, reject) {
        var duplicate = document.querySelectorAll("[src=\"" + url + "\"]")

        if(duplicate.length > 0) {
            return reject("Failed to load script from origin '" + url + "' as it was loaded already!", duplicate[0])
        }

        var elem = document.createElement("script")
        elem.type = "text/javascript"
        elem.src = url
        elem.async = false
        elem.addEventListener("load", resolve.bind(this, elem))
        
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



function iframe(origin, parent) {
    return new Promise(function(resolve) {
        var ifrm = document.createElement("iframe")
        ifrm.src = "about:blank"
        ifrm.width = "100%"
        ifrm.height = 0
        ifrm.style.overflow = "hidden"
        ifrm.style.border = "none"
        ifrm.style.display = "none"
        ifrm.classList.add("gh-fit")

        ifrm.addEventListener("load", function(event) {
            event.target.style.display = "block"
            return resolve(event.target)
        })

        if(origin.startsWith("http") && !origin.startsWith(window.location.origin)) {
            copy(origin).then(function(source) {
                ifrm.srcdoc = relink(source)
            })
        } else {
            ifrm.src = origin
        }

        (parent || document.body).appendChild(ifrm) // leverage native DOMParser
    })
}



async function main() {
    var grid = document.getElementsByClassName("gh-grid")[0]

    var a = await iframe("https://freshman.tech/custom-html5-video/", grid)
    a.classList.add("gh-grid-double")
    
    await iframe("/template/box3d.html", grid)
    await iframe("/template/grid.html", grid)
    await iframe("/template/hyperlink.html", grid)
    var b = await iframe("/template/playlist.html", grid)
    b.classList.add("gh-fit")

    
    // var e = await iframe("https://css-tricks.com/snippets/jquery/fit-iframe-to-content")
    // e.classList.add("gh-fit")

    // await iframe("https://apple.com")

    // iframe("http://designtagebuch.de")
    // iframe("https://mirelleborra.com", grid)
    // iframe("https://www.youtube.com/channel/UC3Qk1lecHOkzYqIqeqj8uyA?view_as=subscriber", grid)
    // iframe("https://amazon.de", grid)
}



window.addEventListener("load", function() {
    // script("style/iframe.js")
    // .catch(console.warn)
    // .then(function() {
        main()
    //     window.fit()
    // })
})
