window.console = window.console || {
    log: function () { },
    warn: function () { },
    error: function () { }
};

(function () {
    var a, b, c, d, e;

    // Get imgur domain from script tags
    var getImgurDomain = function () {
        var scripts = document.getElementsByTagName("script");
        for (var i in scripts) {
            var match = /^(http(s)?:){0,1}\/\/([a-z]{1,}\.)*?(imgur(-dev)?.com)/.exec(scripts[i].src);
            if (match) {
                if (match[0].indexOf("//s.imgur.com") === -1 && match[3] && match[5]) {
                    return match[0];
                } else if (match[1]) {
                    return match[1] + "//imgur.com";
                } else {
                    return window.location.protocol + "//imgur.com";
                }
            }
        }
    };

    var g = window,
        h = document,
        i = h.documentElement,
        j = h.getElementsByTagName("body")[0],
        k = 500,
        l = getImgurDomain(),
        m = 540,
        n = 200,
        eventType = g.addEventListener ? "addEventListener" : "attachEvent",
        eventMethod = g[eventType],
        messageEvent = eventType === "attachEvent" ? "onmessage" : "message";

    // Listen for messages from iframe
    eventMethod(messageEvent, function (event) {
        var data;
        try {
            data = JSON.parse(event.data);
        } catch (err) {
            data = { message: event.data };
        }
        var regex = /.com\/(.+)\/embed/g;
        if (data.message === "resize_imgur") {
            var id = regex.exec(data.href)[1];
            id = id.replace(/\//g, "-");
            setHeight(data.height, id);
        } else if (data.message === "404_imgur_embed") {
            var id = regex.exec(data.href)[1];
            setHeight(n, id);
        }
    }, false);

    // Add CSS to head
    var addStyle = function (css) {
        var head = h.getElementsByTagName("head")[0],
            style = h.createElement("style");
        style.type = "text/css";
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(h.createTextNode(css));
        }
        head.appendChild(style);
    };

    // Set iframe height by id
    var setHeight = function (height, id) {
        height = parseFloat(height);
        if (isNaN(height)) height = k;
        if (/^(a\-)?[a-z0-9]{5,7}$/gi.test(id)) {
            var css = "#imgur-embed-iframe-pub-" + id + " { height: " + height + "px !important;width:" + c + "px !important;}";
            addStyle(css);
        }
    };

    // Add default styles
    var addDefaultStyles = function () {
        var css = ".imgur-embed-iframe-pub { box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.10); border: 1px solid #ddd; border-radius: 2px;} blockquote.imgur-embed-pub { width: " + m + "px; }";
        addStyle(css);
    };

    // Build iframe src URL
    var buildSrc = function (isAlbum, context, id, analytics) {
        var base = [l, id, "embed"].join("/"),
            loc = window.location,
            ref = "ref=" + encodeURIComponent(loc.href || loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "") + loc.pathname + loc.search);

        if (isAlbum) {
            base += "?pub=true&" + ref;
            if (context === "false") base += "&context=false";
        } else {
            base += context === "false" ? "?context=false&" + ref : "?" + ref;
        }
        if (analytics === "false") base += "&analytics=false";
        base += "&w=" + c;
        return base;
    };

    // Create and insert iframe
    var createIframe = function (block) {
        if (block) {
            e = h.createElement("iframe");
            var context, analytics, id, isAlbum, width;
            try {
                context = block.getAttribute("data-context") || "true";
                analytics = block.getAttribute("data-analytics") || "true";
                id = block.getAttribute("data-id");
                isAlbum = id.indexOf("a/") === 0;
                width = block.parentNode.offsetWidth;
            } catch (err) {
                console.error(err);
                return;
            }
            var isTouch = (function () {
                try {
                    return h.createEvent("TouchEvent"), true;
                } catch (err) {
                    return false;
                }
            })();
            a = isTouch ? 300 : 400;
            e.setAttribute("allowfullscreen", true);
            e.setAttribute("mozallowfullscreen", true);
            e.setAttribute("webkitallowfullscreen", true);
            e.style.height = k + "px";
            c = width < m ? (width < a ? a : width) : m;
            e.style.width = c + "px";
            d = "imgur-embed-iframe-pub-" + id.replace("/", "-") + "-" + context + "-" + c;
            e.className = "imgur-embed-iframe-pub " + d;
            e.style.margin = "10px 0px";
            e.style.padding = 0;
            e.scrolling = "no";
            var src = buildSrc(isAlbum, context, id, analytics);
            e.src = src;
            e.id = "imgur-embed-iframe-pub-" + id.replace(/\//g, "-");
            block.parentNode.replaceChild(e, block);
        }
    };

    addDefaultStyles();

    g.imgurEmbed.createIframe = function () {
        createIframe(h.querySelector("blockquote.imgur-embed-pub"));
    };

    for (var w = 0; w < g.imgurEmbed.tasks; w++) {
        createIframe(h.querySelector("blockquote.imgur-embed-pub"));
    }
})();