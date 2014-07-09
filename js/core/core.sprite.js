(function() {
    function Sprite(url, pos, size, speed, frs, dir, once) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frs = frs;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
        this.level = 0;
    }

    Sprite = {
        updateSprite: function(sprite, dt) {
            sprite._index += sprite.speed * dt;
            sprite.set('_index', sprite._index);
        },
        createSprite: function(url, pos, levels, size, speed, frs, dir, once) {
            Core.Console.log('Sprite: new init by: ' + url);
            // Check in resources cache
            if (!this.prototype.isset(url))
                this.prototype.load([url]);
            return {
                set: function(k, v) {
                    this[k] = v;
                },
                resourceSrc: url,
                speed: speed,
                frs: frs,
                fr: 0,
                once: once,
                done: false,
                dir: dir,
                pos: pos,
                level: 0,
                levels: levels,
                size: size,
                _index: 0,
            };
        },
        renderSprite: function(ctx, sprite) {
            if (sprite.speed > 0) {
                var max = sprite.frs.length;
                var idx = Math.floor(sprite._index);
                sprite.fr = sprite.frs[idx % max];

                if (sprite.once && idx >= max) {
                    sprite.done = true;

                    return;
                }
            }
            else {
                sprite.fr = 0;
            }

            sprite.set('done', sprite.done);
            sprite.set('fr', sprite.fr);

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