function assert(condition, message) {
    if(!condition) {
        throw message || "Assertion failed!";
    }
}



function copy(origin, use) {
    var api = "https://api.allorigins.win/get?url="; // https://github.com/gnuns/allorigins
    var uri = api + encodeURIComponent(origin);
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



function fit(element) {
    if(typeof element !== "undefined" && element instanceof HTMLElement) {
        var doc = element.contentDocument || element.contentWindow.document;
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
        element.style.width = "100%";
        element.style.height = height + "px"; // fit size to content
        element.style.border = "none";
        element.style.overflow = "hidden";
        element.setAttribute("scrolling", "no");
        element.style.border = "thin dotted red"; // for debugging
    } else {
        if(!HTMLCollection.prototype.isPrototypeOf(element)) {
            element = document.getElementsByTagName("iframe");
        }
        for(var id = 0; id < element.length; id++) {
            element[id].style.height = 0; // force to change (important so some browsers)
            fit(element[id]);
        }
    }
}



function observe(element, handler) {
    var listener = new MutationObserver(handler);
    listener.observe(element, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });
    return listener; // to remove listener call listener.disconnect()
}



function iframe(origin, parent) {
    var element = document.createElement("iframe");
    
    // element.addEventListener("load", fit.bind(element));
    element.addEventListener("load", function() {
        var body = (element.contentDocument || element.contentWindow.document).body;
        observe(body, fit.bind(element));
        fit(element);
    });

    if(origin.startsWith("http") && !origin.startsWith(window.location.origin)) {
        copy(origin, function(source) {
            element.srcdoc = source;
        });
    } else {
        element.src = origin;
    }

    (parent || document.body).appendChild(element);
    return element;
}



window.addEventListener("resize", fit);
window.addEventListener("load", function() {
    var grid = document.getElementsByClassName("gh-grid")[0];
    iframe("template/box3d.html", grid);
    iframe("template/grid.html", grid);
    iframe("template/hyperlink.html", grid);
    iframe("template/playlist.html", grid);
    // iframe("http://designtagebuch.de", grid);
    // iframe("https://mirelleborra.com", grid);
    iframe("https://freshman.tech/custom-html5-video/", grid);
    // iframe("https://www.youtube.com/channel/UC3Qk1lecHOkzYqIqeqj8uyA?view_as=subscriber", grid);
    // iframe("https://amazon.de", grid);
});





// try this:
// copy(origin)
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
