function gh_fit() {
    Array.from(document.querySelectorAll("iframe.gh-fit"))
    .filter(function(iframe) { // same-origin
        return typeof iframe.srcdoc === "string"
        || typeof iframe.src !== "string"
        || iframe.src.length < 1
        || iframe.src === "about:blank"
        || new URL(iframe.src).origin === location.origin
    })
    .forEach(function(iframe) {
        var doc = iframe.contentWindow.document
        var html = doc.documentElement
        var body = doc.body

        if(body) {
            body.style.overflowX = "scroll" // scrollbar-jitter fix
            body.style.overflowY = "hidden"
        }
        if(html) {
            html.style.overflowX = "scroll" // scrollbar-jitter fix
            html.style.overflowY = "hidden"
    
            var style = getComputedStyle(html)
            iframe.width = parseInt(style.getPropertyValue("width")) // round value
            iframe.height = parseInt(style.getPropertyValue("height"))
        }
    })
    requestAnimationFrame(gh_fit)
}

requestAnimationFrame(gh_fit)
