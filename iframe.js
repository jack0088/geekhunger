function grab(origin, use) {
    // https://github.com/gnuns/allorigins
    // https://github.com/Rob--W/cors-anywhere/
    var api = "https://api.allorigins.win/get?url=";
    var uri = api + encodeURIComponent(origin || window.location.origin);
    fetch(uri)
    .then(function(response) {
        if(response.ok) {
            return response.json();
        }
    })
    .then(function(data) {
        use(data.contents);
    });
}


function stretch(elem) {
    var iframes = elem ? [elem] : document.getElementsByTagName("iframe");
    for(var id = 0; id < iframes.length; id++) {
        var elem = iframes[id];
        var doc = elem.contentDocument || elem.contentWindow.document;
        var html = doc.documentElement;
        var body = doc.body;
        var height = Math.max(
            body.offsetHeight,
            body.scrollHeight,
            html.offsetHeight,
            html.scrollHeight,
            html.clientHeight
        );

        body.style.margin = 0;
        body.style.padding = 0;

        elem.style.width = "100%";
        elem.style.height = height + "px"; // fit size to content

        elem.style.border = "none";
        elem.style.overflow = "hidden";
        elem.setAttribute("scrolling", "no");
        elem.style["background-color"] = "yellow";
    }
}


function iframe(origin, parent) {
    var elem = document.createElement("iframe");
    elem.onload = function() {
        stretch(elem);
    };
    if(origin.startsWith("http") && !origin.startsWith(window.location.origin)) {
        grab(origin, function(src) {
            elem.srcdoc = src;
        });
    } else {
        elem.src = origin;
    }
    (parent || document.body).appendChild(elem);
}


window.addEventListener("load", function() {
    stretch();
    iframe("https://mirelleborra.com/about", document.getElementById("playlist"));
});


window.addEventListener("resize", function() {
    var iframes = document.getElementsByTagName("iframe");
    for(var id = 0; id < iframes.length; id++) {
        var elem = iframes[id];
        elem.style.height = "0%";
        elem.style.height = 0;
        stretch(elem);
    }
});
