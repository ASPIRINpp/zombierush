(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        Core.Console.log('Resource: load ' + urlOrArr);
        if (urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {

        Core.Console.log('Resource: download ' + url);

        if (resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                Core.Console.log('Resource: download(' + url + ') done!');
                if (isReady()) {
                    Core.Console.log('!Resource: all resources done!');
                    readyCallbacks.forEach(function(func) {
                        func();
                    });
                }

            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
//        Core.Console.log('Resource: get ' + url);
        return resourceCache[url];
    }

    function isReady() {
        var ready = true;
        for (var k in resourceCache) {
            if (resourceCache.hasOwnProperty(k) &&
                    !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    Resource = {
        getCache: function() {
            console.log(resourceCache);
        },
        isset: function(url) {
            return !(typeof resourceCache[url] === 'undefined');
        },
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };

    Resource.prototype = {
         isset: function(url) {
            return !(typeof resourceCache[url] === 'undefined');
        },
        load: load,
        get: get,
    };


    Core.include('Resource', Resource);

    // Load sprite module
    Core.includeModule('sprite');
})();