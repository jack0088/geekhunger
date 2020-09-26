function grab(origin, use) {
    // https://github.com/gnuns/allorigins
    // https://github.com/Rob--W/cors-anywhere/
    var api = "https://api.allorigins.win/get?url="; // https://api.allorigins.win/raw?url=
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
    elem.addEventListener("load", function() {
        stretch(elem);
    });
    if(origin.startsWith("http") && !origin.startsWith(window.location.origin)) {
        grab(origin, function(src) {
            elem.srcdoc = src;
        });
    } else {
        elem.src = origin;
    }
    (parent || document.body).appendChild(elem);
    return elem;
}


window.addEventListener("load", function() {
    stretch();
    iframe("https://youtube.de", document.getElementById("playlist"));
});


window.addEventListener("resize", function() {
    var iframes = document.getElementsByTagName("iframe");
    for(var id = 0; id < iframes.length; id++) {
        var elem = iframes[id];
        elem.style.height = 0;
        stretch(elem);
    }
});


// try this:
// grab(origin)
// then append to html source <base href="https://api.allorigins.win/get?callback=update&url=" + iframe.location.origin>
// the base should automatically prepend all href, action, src values
// when user clicks link inside the iframe or fires an action, it will go through the proxy obove and come back
// and invoke the update() callback function
// which updates the iframe.srcdoc (which hopefully re-parses the dom tree automatically)

// see https://developer.mozilla.org/de/docs/Web/HTML/Element/base
// and 




//https://developer.mozilla.org/en-US/docs/Web/API/Window/frames
//If you have some logic based on the styles of the iframe tag in the parent page (e.g. its width or height), you can use window.frameElement which will point you to the containing iframe object:
/*
The most simple, efficient and correct way to do so it to just use URL api.

new URL("http://www.stackoverflow.com?q=hello").href;
//=> http://www.stackoverflow.com/?q=hello"

new URL("mypath","http://www.stackoverflow.com").href;
//=> "http://www.stackoverflow.com/mypath"

new URL("../mypath","http://www.stackoverflow.com/search").href
//=> "http://www.stackoverflow.com/mypath"

new URL("../mypath", document.baseURI).href
//=> "https://stackoverflow.com/questions/mypath"
Performance wise, this solution is on par with using string manipulation and twice as fast as creating a tag.
*/
