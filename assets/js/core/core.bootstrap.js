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
         * Checl typeof !== 'undefined'
         * @param {mixed} o Object
         * @returns {Boolean} Result
         */
        isset: function(o) {
            return (typeof o !== 'undefined');
        },
        /**
         * Get current timestamp
         * @returns {Number}
         */
        getTimestamp: function() {
            return (new Date()).getTime();
        },
        /**
         * Generate rand int
         * @param {type} min Minimum number
         * @param {type} max Maximum number
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
         * Extend prototype
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
         * Add children object
         * @param {object} parent Parent
         * @param {string} childName Children name
         * @param {object} child Children object
         * @returns {undefined}
         */
        addChild: function(parent, childName, child) {
            parent[childName] = child;
        },
        /**
         * Calculate FPS (fill Core.fps object)
         * @returns {undefined}
         */
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
        },
        /**
         * Merge objects
         * @param {type} a
         * @param {type} b
         * @returns {module.Helper.merge.a}
         */
        merge: function(a, b) {
            for (var k in b) 
                a[k] = b[k];
        }
    };

    if (Core.aliasMode === true)
        window.CH = Core.Helper;

    /**
     * Time object
     */
    Core.Time = {
        /**
         * Active timers
         */
        timers:[],
        /**
         * lastTime update
         */
        lastTime: 0,
        /**
         * Get Date.now()
         * @returns {Number}
         */
        now: function() {
            return Date.now();
        },
        /**
         * Caclulation date delta
         * @returns {Number}
         */
        getDt: function() {
            return (this.now() - this.lastTime) / 1000.0;
        },
        /**
         * Alias for getDt
         * @returns {Number}
         */
        dt: function() {
            return this.getDt();
        },
        /**
         * Set new last time
         * @param {type} time
         * @returns {undefined}
         */
        setLastTime: function(time) {
            this.lastTime = time;
        },
        /**
         * Alias for setLastTime
         * @param {type} t
         * @returns {undefined}
         */
        sLT: function(t) {
            this.setLastTime(t);
        },
        /**
         * Set timeout
         * @returns {undefined}
         */
        setTimeout: function(callback, time) {
            this.timers.push([this.now() + time, callback]);
        },
        updateTimers: function() {
            var timers = this.timers,
                    now = this.now();
            for (var k = 0, count = timers.length; k < count; k++) {
                if (typeof timers[k] !== 'undefined' && timers[k][0] <= now) {
                    timers[k][1]();
                    this.timers.splice(k, 1);
                }
            }
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
    // Load Render module
    Core.includeModule('terrain');
    // Load roads
    Core.includeModule('roads');

})();