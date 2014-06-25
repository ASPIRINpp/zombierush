var Core = {};

(function() {

    var CORE_PATH = '/js/core',
            CORE_PREFIX = 'core.',
            MIN_PREFIX = '';

    var _onReady = [];

    Core = {
        version: '0.1',
        developMode: true,
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
        includeModule: function(name) {
            this.includeJs(CORE_PATH + '/' + CORE_PREFIX + MIN_PREFIX + name + '.js');
        },
        onReady: function(code) {
            _onReady.push(code);
        },
        ready: function() {
            //Execute on ready
            for (var k in _onReady)
                _onReady[k]();
            _onReady = [];
        }
    };

    // Load bootstrap
    Core.includeModule('bootstrap');



})();