(function() {
    function Sprite(url, pos, size, speed, frames, dir, once) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
        
         Core.Console.log('Sprite: new init by: '+url);
        
        // Check in resources cache
        if(!this.isset(url))
            this.load([url]);
    };

    Sprite.prototype = {
        
        getSize: function(index, level) {
          return this.size[index] * level;
        },
        
        update: function(dt) {
            this._index += this.speed*dt;
        },

        render: function(ctx, level) {
            
            Core.Console.log('Sprite: render '+this.url);
            
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.getSize(1, level);
            }
            else {
                x += frame * this.getSize(0, level);
            }

            ctx.drawImage(this.get(this.url),
                          x, y,
                          this.getSize(0, level), this.getSize(1, level),
                          0, 0,
                          this.getSize(0, level), this.getSize(1, level));
        }
    };
    
    Core.Console.log('Init module Core.Sprite...');
    Core.Sprite = Sprite;
    Core.Console.log('Init module Core.Sprite extend Core.Resource...');
    Core.Helper.extend(Core.Sprite, Core.Resource);
    
    Core.ready();
    
})();