(function() {


    Core.Console = {
        log: function(msg) {
            if (Core.developMode)
                console.log('App: ' + msg);
        }
    };

    Core.Helper = {
        extend: function(c1, c2) {
            for (var key in c2.prototype) {
                if (!(key in c1.prototype)) {
                    c1.prototype[key] = c2.prototype[key];
                }
            }
        },
        extendPrototype: function(child, parent) {
            var F = function() {
            };
            F.prototype = parent.prototype;
            child.prototype = new F();
            child.prototype.constructor = child;
            child.superclass = parent.prototype;
        },
        addMethods: function(constructor, methods) {
            var key;
            for (key in methods) {
                constructor.prototype[key] = methods[key];
            }
        }
    };

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


    Core.Console.log('Init bootstrap module!');

    // Load resource module
    Core.includeModule('resource');

    // Load storage module
    Core.includeModule('storage');

})();