function gh_fit() {
    document.querySelectorAll("iframe.gh-fit").forEach(function(iframe) {
        if(location.origin === new URL(iframe.src).origin) { // avoid collision with CORS restriction
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
        }
    })
    requestAnimationFrame(gh_fit)
}

requestAnimationFrame(gh_fit)
