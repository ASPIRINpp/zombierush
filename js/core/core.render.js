(function() {

    var _storage = new Array();

    function putStorage(time, lambda) {
        _storage.push({expired: time, lambda: lambda});
    }

    var _methods = {
        renderBaloon: function(text, pos, ctx) {
            // Get canvas
            ctx = Core.Helper.isset(ctx) ? ctx : Core.ctx;
            ctx.fillStyle = 'black';
            ctx.font = '15px Arial';
            ctx.fillText(text, pos[0], pos[1]);
        }
    };

    Render = {
        go: function(ctx) {
            // Get canvas
            ctx = Core.Helper.isset(ctx) ? ctx : Core.ctx;
            // Get sprites
            var sprites = Core.Sprite.getAll();

            // Render!
            for (var k in sprites)
            {
                Core.ctx.save();
                Core.ctx.translate(sprites[k].posOnMap[0], sprites[k].posOnMap[1]);
                Core.Sprite.render(ctx, sprites[k]);
                Core.ctx.restore();
            }

            // Render others elements
            for (var k in _storage)
            {
                if (_storage[k].expired > Core.Helper.getTimestamp())
                    _storage[k].lambda();
                else
                    _storage.splice(k, 1);
            }
        },
        /**
         * 
         * @param {type} livetime in ms
         * @param {type} lambda
         * @returns {undefined}
         */
        addObject: function(livetime, lambda) {
            var time = Core.Helper.getTimestamp() + livetime;
            putStorage(time, lambda);
        },
        /**
         * 
         * @param {type} text
         * @param {type} pos
         * @param {type} ctx
         * @returns {undefined}
         */
        renderBallon: function(text, pos, ctx) {
            _methods.renderBaloon(text, pos, ctx);
        }
    };

    Core.include('Render', Render);
})();