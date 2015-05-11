(function() {
    // private:
    var _layers = [], _pattern;

    /**
     * Render layer by index
     * @param {int} index Index for _layers
     * @returns {undefined}
     */
    function renderLayer(index) {
        Core.ctx.drawImage(Game.res.get(_layers[index][0]), _layers[index][1][0], _layers[index][1][1]);
    }

    /**
     * Render patter from _pattern
     * @returns {undefined}
     */
    function renderPattern() {
        Core.ctx.fillStyle = _pattern;
        Core.ctx.fillRect(0, 0, Core.canvas.width, Core.canvas.height);
    }

    /**
     * Render all layers
     * @returns {undefined}
     */
    function renderLayers() {
        if (_layers.length > 0)
            for (var k in _layers)
                renderLayer(k);
    }

    // public:
    Terrain = {
        go: function() {
            renderPattern();
            renderLayers();
        },
        setPattern: function(ptrn) {
            _pattern = ptrn;
        },
        createPattern: function(resource, direction) {
            direction = Core.Helper.isset(direction) ? direction : 'repeat';
            _pattern = Core.ctx.createPattern(Game.res.get(resource), direction);
        },
        addLayer: function(resource, pos) {
            _layers.push([resource, pos]);
        }
    };

    Core.include('Terrain', Terrain);

})();