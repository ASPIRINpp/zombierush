(function() {

    var _storage = new Array();

    /**
    * Put additional actions to render
    * time: expired time
    * lambda: execute function
    */
    function putStorage(time, lambda) {
        _storage.push({expired: time, lambda: lambda});
    }

    /**
    * Sorting sprites by Y positions
    * 
    */
    function sorting(sprites) {
        var sortable = [];

        for (var i = 0, count = sprites.length; i < count; i++) {
            sortable.push([i, sprites[i].posOnMap[1]]);
        }
        
        sortable.sort(function(a, b) {return a[1] - b[1]});

        var result = [];
        for (var i = 0, count = sortable.length; i < count; i++) {
            result.push(sortable[i][0]);
        }

        return result;
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
            Core.Helper.calcFps();

            // Scope optimization
            var CoreSprite = Core.Sprite,
            CoreCTX = Core.ctx,
            CoreTime = Core.Time,
            CoreHelper = Core.Helper;

            // Get canvas
            ctx = CoreHelper.isset(ctx) ? ctx : Core.ctx;
            
            // Get sprites
            var sprites = CoreSprite.getAll();
            
            // Sorting
            var sortingSprites = sorting(sprites);

            // Render!
            for (var k = 0, count = sortingSprites.length; k < count; k++)
            {
                CoreCTX.save();
                CoreCTX.translate(sprites[sortingSprites[k]].posOnMap[0], sprites[sortingSprites[k]].posOnMap[1]);
                CoreSprite.render(ctx, sprites[sortingSprites[k]]);
                CoreSprite.update(sprites[sortingSprites[k]], CoreTime.dt());
                CoreCTX.restore();
            }

            // Render others elements / run lambda functions
            for (var k = 0, count = _storage.length; k < count; k++)
            {
                if (_storage[k].expired > CoreHelper.getTimestamp()) {
                    _storage[k].lambda();
                } else {
                    _storage.splice(k, 1);
                    k--;
                    count--;
                }
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