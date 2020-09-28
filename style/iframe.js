function fit() {
    var iframes = document.querySelectorAll("iframe.gh-fit")

    for(var id = 0; id < iframes.length; id++) {
        var win = iframes[id].contentWindow
        var doc = win.document
        var html = doc.documentElement
        var ifrm = iframes[id] // or win.frameElement
        var body = doc.body
        var style = win.realtimeStyle

        if(html) {
            html.style.overflow = "hidden"
            if(!style) {
                win.realtimeStyle = win.getComputedStyle(html) // cache pointer for performance?
                style = win.realtimeStyle
            }
        }
        if(body) {
            body.style.overflow = "hidden"
        }
        if(style) {
            // var value = style.getPropertyValue("height")
            // if(typeof value === "string" && value.endsWith("px")) ifrm.height = value
            ifrm.height = parseInt(style.getPropertyValue("height"))
        }
    }

    this.requestAnimationFrame(this.fit)
}

window.addEventListener("load", window.requestAnimationFrame.bind(window, fit))
