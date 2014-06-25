(function() {

    Core.Helper = {
        extend: function(c1, c2) {
            for (var key in c2.prototype) {
                if (!(key in c1.prototype)) {
                    c1.prototype[key] = c2.prototype[key];
                }
            }
        },
        extendPrototype: function(child, parent) {
            var F = function() {};
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

    Core.Console = {
        log: function(msg) {
            if (Core.developMode)
                console.log('App: ' + msg);
        }
    };

    Core.Console.log('Init bootstrap module!');
    
    // Load resource module
    Core.includeModule('resource');
    // Load sprite module
    Core.includeModule('sprite');
    
    

})();