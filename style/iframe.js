function fit() {
    var iframes = document.querySelectorAll("iframe.gh-fit")

    for(var id = 0; id < iframes.length; id++) {
        var win = iframes[id].contentWindow
        var doc = win.document
        var html = doc.documentElement
        var body = doc.body
        var ifrm = iframes[id] // or win.frameElement

        if(body) {
            body.style.overflow = "hidden"
        }
        if(html) {
            html.style.overflow = "hidden"
            var style = win.getComputedStyle(html)
            ifrm.height = parseInt(style.getPropertyValue("height")) // round value
        }
    }

    requestAnimationFrame(fit)
}

addEventListener("load", requestAnimationFrame.bind(this, fit))
