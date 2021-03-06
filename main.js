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
        script.addEventListener("load", resolve.bind(this, script))
        script.type = "text/javascript"
        script.src = url
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



async function gh_relink(source) {
    // TODO
    // var blacklist = page.querySelectorAll("[src], [href], [action]")
    return source
}



function gh_proxy(origin, iframe) {
    if(typeof origin !== "undefined" && typeof iframe !== "undefined") {
        gh_copy(origin)
        .then(gh_relink)
        .then(function(source) {
            iframe.srcdoc = source
        })
    } else {
        Array.from(document.querySelectorAll("iframe.gh-fit"))
        .filter(function(iframe) { // cross-origin
            return typeof iframe.src === "string"
            && iframe.src.length > 0
            && iframe.src !== "about:blank"
            && new URL(iframe.src).origin !== location.origin
        })
        .forEach(function(iframe) {
            gh_proxy(iframe.src, iframe)
        })
    }
}



function gh_iframe(origin, parent) {
    var iframe = document.createElement("iframe")
    // iframe.sandbox = "allow-same-origin allow-scripts" // disable sandbox
    iframe.classList.add("gh-fit") // this is the css-class that gh/iframe.js automatically reacts to
    iframe.classList.add("gh-fullwidth")
    document.appendChild.call(parent || document.body, iframe) // Why??? Because:
    // I omit semicolons and this confuses the js compiler sometimes, e.g. `TypeError "block" is not a function`
    // I could have used `;(parent || document.body, iframe).appendChild(iframe)` instead
    if(origin.startsWith("http") && !origin.startsWith(location.origin)) {
        iframe.src = "about:blank"
        gh_proxy(origin, iframe)
    } else {
        iframe.src = origin
    }
    return iframe
}



addEventListener("DOMContentLoaded", function() {
    gh_script("gh/iframe.js").catch(console.warn)
    
    var grid = document.getElementsByClassName("gh-grid")[0]

    function preset(iframe) {
        iframe.classList.add("gh-fit") // for debugging (this gets set automatically)
        iframe.classList.add("gh-fullwidth")
    }
    
    gh_iframe("demo/media.html", grid)

    // gh_iframe("https://css-tricks.com/snippets/jquery/fit-iframe-to-content")
    // gh_iframe("https://freshman.tech/custom-html5-video", grid)
    // gh_iframe("https://apple.com")
    // gh_iframe("http://designtagebuch.de")
    // gh_iframe("https://mirelleborra.com", grid)
    // gh_iframe("https://www.youtube.com/channel/UC3Qk1lecHOkzYqIqeqj8uyA?view_as=subscriber", grid)
    // gh_iframe("https://amazon.de", grid)

    // gh_proxy()
})
