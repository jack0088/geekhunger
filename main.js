function gh_assert(condition, message) {
    if(!condition) throw message || "Assertion failed!"
}



function gh_script(url) {
    return new Promise(function(resolve, reject) {
        var duplicate = document.querySelectorAll("[src=\"" + url + "\"]")

        if(duplicate.length > 0) {
            return reject("Failed to load script from origin '" + url + "' as it was loaded already!", duplicate[0])
        }

        var script = document.createElement("script")
        script.type = "text/javascript"
        script.src = url
        script.addEventListener("load", resolve.bind(this, script))
        
        document.head.appendChild(script)
    })
}



async function gh_copy(origin) {
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



function gh_relink(source) {
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



function gh_iframe(origin, parent, setup) {
    return new Promise(function(resolve) {
        var iframe = document.createElement("iframe")
        iframe.src = "about:blank"
        iframe.style.maxWidth = "100%"
        iframe.style.overflowX = "scroll"
        iframe.style.overflowY = "hidden"
        iframe.style.border = "none"
        iframe.style.display = "none"
        iframe.classList.add("gh-fit") // this is the css-class that gh/iframe.js automatically reacts to

        iframe.addEventListener("load", function(event) {
            setup(event.target) // custom func to batch-add additional css-classes, etc
            event.target.style.display = "block"
            return resolve(event.target)
        })

        if(origin.startsWith("http") && !origin.startsWith(window.location.origin)) {
            gh_copy(origin).then(function(source) {
                iframe.srcdoc = gh_relink(source)
            })
        } else {
            iframe.src = origin
        }

        (parent || document.body).appendChild(iframe) // leverage native DOMParser
    })
    // TODO this should work for cross-origin sources like gh_fit(), via css class selector
    // if add gh-deepcopy then gh_copy() proxy will kick in
    // src is used as origin and src is replaced by "about:blank" ... etc
}



async function gh_run() {
    var grid = document.getElementsByClassName("gh-grid")[0]

    function settings(iframe) {
        iframe.classList.add("gh-fit") // for debugging (this gets set automatically)
        iframe.classList.add("gh-fullwidth")
    }
    
    // gh_iframe("template/box3d.html", grid, settings)

    // gh_iframe("template/grid.html", grid, settings).then(function(f) {
    //     f.classList.add("gh-fullwidth") // for debugging (just testing)
    //     f.style.backgroundColor = "red"
    // })

    // gh_iframe("https://freshman.tech/custom-html5-video/", grid, settings).then(function(f) {
    //     f.classList.add("gh-grid-double")
    // })

    gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // gh_iframe("template/media.html", grid, settings)
    // await gh_iframe("template/hyperlink.html", grid, settings)
    
    // gh_iframe("https://css-tricks.com/snippets/jquery/fit-iframe-to-content")

    // await gh_iframe("https://apple.com")
    // gh_iframe("http://designtagebuch.de")
    // gh_iframe("https://mirelleborra.com", grid)
    // gh_iframe("https://www.youtube.com/channel/UC3Qk1lecHOkzYqIqeqj8uyA?view_as=subscriber", grid)
    // gh_iframe("https://amazon.de", grid)
}



addEventListener("load", async function() {
    await gh_script("gh/iframe.js").catch(console.warn)
    gh_run().then(gh_fit) // invoke gh_fit manually, as the script will miss its load-event uppon inclusion
})
