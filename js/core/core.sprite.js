
(function() {
    // Storage
    var _storageSprites = new Array();

    /**
     * Put Sprite in storage
     * @param {object} sprite Sprite
     * @returns {undefined}
     */
    function putSprite(sprite) {
        return (_storageSprites.push(sprite) - 1);
    }

    /**
     * Get NPC from storage
     * @param {string} id Name of sprite
     * @returns {object} Sprite
     */
    function getSprite(id) {
        return _storageSprites[id];
    }

    function getDefault() {
        return {
            // Unique sprite id
            id: null,
            // Resource url
            resourceSrc: null,
            // Position
            pos: [0, 0],
            size: [64, 64],
            frames: [],
            speed: 0,
            dir: 'horizontal',
            once: false,
            level: 0,
            _index: 0,
            levels: {bottom: 0, right: 1, left: 2, top: 3, die: 6}
        };
    }

    Sprite = {
        get: function(id) {
            return getSprite(id);
        },
        getAll: function() {
            return _storageSprites;
        },
        update: function(sprite, dt) {
            if (!CH.isset(sprite) || !CH.isset(sprite._index))
            {
                console.log('sprite>>>');
                console.log(sprite);
            }
            sprite._index += sprite.speed * dt;
//            sprite.set('_index', sprite._index);
        },
        add: function(url, pos, posOnMap, levels, size, speed, frs, dir, once) {
            Core.Console.log('Sprite: new init by: ' + url);

            var index = putSprite({
                resourceSrc: url,
                speed: speed,
                frs: frs,
                fr: 0,
                once: once,
                done: false,
                dir: dir,
                pos: pos,
                posOnMap: posOnMap,
                level: 0,
                levels: levels,
                size: size,
                _index: 0
            });

            return index;
        },
        render: function(ctx, sprite) {

            if (sprite.speed > 0) {
                var max = sprite.frs.length;
                var idx = Math.floor(sprite._index);

                sprite.fr = sprite.frs[idx % max];
//                console.log(idx % max);
                if (sprite.done)
                {
                    if (sprite.once && idx >= max) {
                        sprite.done = true;
                        return;
                    }
                }
            }
            else {
                sprite.fr = 0;
            }

//            sprite.set('done', sprite.done);
//            sprite.set('fr', sprite.fr);

            var x = sprite.pos[0];
            var y = sprite.pos[1];
            if (sprite.dir == 'vertical') {
                y += sprite.fr * sprite.size[1];
                x += sprite.size[0] * sprite.level;
            }
            else {
                x += sprite.fr * sprite.size[0];
                y += sprite.size[1] * sprite.level;
            }


            ctx.drawImage(Core.Resource.get(sprite.resourceSrc),
                    x, y,
                    sprite.size[0], sprite.size[1],
                    0, 0,
                    sprite.size[0], sprite.size[1]);
        }
    };

    Sprite.prototype = {};

    Core.include('Sprite', Sprite, function() {
        Core.Helper.extend(Core.Sprite, Core.Resource);
    });
    Core.Console.log('Init module Core.Sprite extend Core.Resource...');

})();