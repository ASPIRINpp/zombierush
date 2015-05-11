var Core = {};

(function() {

    var CORE_PATH = '/assets/js/core',
            CORE_PREFIX = 'core.',
            MIN_PREFIX = '';

    var _onReady = [];

    var loadingIncludes = 0;

    Core = {
        version: '0.1',
        developMode: false,
        forceMode: true,
        aliasMode: true,
        fps: {
            current: 0,
            filter: 0,
            hits:0,
        },
        canvas: {
            width: 800,
            height: 600
        },
        ctx: null,
        /**
         * Include js in to head
         * @param {string} url File url
         * @param {string} force Added random number GET param, for load without cache
         * @returns {undefined}
         */
        includeJs: function(url, force) {
            force = force ? '?' + Math.random() : '';
            var f = document.createElement("script");
            f.src = url + force;
            document.getElementsByTagName("head")[0].appendChild(f);
        },
        /**
         * Include module
         * @param {string} name Module name
         * @returns {undefined}
         */
        includeModule: function(name, outOfTurn) {
            outOfTurn = outOfTurn ? true : false;
            if (!outOfTurn)
                loadingIncludes++;
            this.includeJs(CORE_PATH + '/' + CORE_PREFIX + MIN_PREFIX + name + '.js', Core.forceMode);
        },
        onReady: function(code) {
            _onReady.push(code);
        },
        ready: function() {
            // Check includes
            if (loadingIncludes > 0)
                return false;

            //Execute on ready
            for (var k in _onReady)
                _onReady[k]();
            _onReady = [];
        },
        createCanvas: function() {
            var canvas = document.createElement("canvas");
            Core.ctx = canvas.getContext("2d");
            canvas.width = 800;
            canvas.height = 600;
            return canvas;
        },
        include: function(name, module, on) {
            loadingIncludes--;
            Core.Console.log('Init module Core.' + name + '...');
            Core[name] = module;
            if (typeof on !== 'undefined')
                on();
            this.ready();
        }
    };

    // Load bootstrap
    Core.includeModule('bootstrap', true);



})();