(function() {

    // Если ничего нет - возвращаем обычный таймер
    window.requestAnimFrame = (function() {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(/* function */ callback, /* DOMElement */ element) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();


    Core.Console = {
        log: function(msg) {
            if (Core.developMode)
                console.log('App: ' + msg);
        },
        group: function(name) {
            if (Core.developMode)
                console.group(name);
        },
        grp: function(n) {
            this.group(n);
        },
        groupCollapsed: function(name) {
            if (Core.developMode)
                console.groupCollapsed(name);
        },
        grpC: function(n) {
            this.groupCollapsed(n);
        },
        groupEnd: function() {
            if (Core.developMode)
                console.groupEnd();
        },
        grpE: function() {
            this.groupEnd();
        }
    };

    if (Core.aliasMode === true)
        window.CC = Core.Console;

    Core.Helper = {
        /**
         * 
         * @param {type} o
         * @returns {Boolean}
         */
        isset: function(o) {
            return (typeof o !== 'undefined');
        },
        /**
         * 
         * @returns {Number}
         */
        getTimestamp: function() {
            return (new Date()).getTime();
        },
        /**
         * 
         * @param {type} min
         * @param {type} max
         * @returns {Number}
         */
        randInt: function(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        /**
         * GUID / UUID rfc4122 version 4 compliant solutio
         * @param {type} mask
         * @returns {undefined}
         */
        unquid: function(mask) {
            mask = this.isset(mask) ? mask : 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx';
            return mask.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        /**
         * 
         * @param {type} c1
         * @param {type} c2
         * @returns {undefined}
         */
        extend: function(c1, c2) {
            for (var key in c2.prototype) {
                if (!(key in c1.prototype)) {
                    c1.prototype[key] = c2.prototype[key];
                }
            }
        },
        /**
         * 
         * @param {type} child
         * @param {type} parent
         * @returns {undefined}
         */
        extendPrototype: function(child, parent) {
            var F = function() {
            };
            F.prototype = parent.prototype;
            child.prototype = new F();
            child.prototype.constructor = child;
            child.superclass = parent.prototype;
        },
        /**
         * 
         * @param {type} constructor
         * @param {type} methods
         * @returns {undefined}
         */
        addMethods: function(constructor, methods) {
            var key;
            for (key in methods) {
                constructor.prototype[key] = methods[key];
            }
        },
        addChild: function(parent, childName, child) {
            parent[childName] = child;
        },
        calcFps: function() {
            var lastTime = Core.fps.filter;
            Core.fps.hits++;
            var nowTime = Core.Time.now();
            if (nowTime - lastTime > 1000) {
                var dt = nowTime - lastTime;
                Core.fps.current = '' + Math.round(Core.fps.hits * 1000 / dt);
                Core.fps.hits = 0;
                Core.fps.filter = nowTime;
            }
        }
    };

    if (Core.aliasMode === true)
        window.CH = Core.Helper;

    Core.Time = {
        lastTime: 0,
        now: function() {
            return Date.now();
        },
        getDt: function() {
            return (this.now() - this.lastTime) / 1000.0;
        },
        dt: function() {
            return this.getDt();
        },
        setLastTime: function(time) {
            this.lastTime = time;
        },
        sLT: function(t) {
            this.setLastTime(t);
        }
    };

    if (Core.aliasMode === true)
        window.CT = Core.Time;

    Core.Console.log('Init bootstrap module!');

    // Load resource module
    Core.includeModule('resource');
    // Load storage module
    Core.includeModule('storage');
    // Load NPC module
    Core.includeModule('npc');
    // Load Render module
    Core.includeModule('render');
    // Load roads
    Core.includeModule('roads');

})();