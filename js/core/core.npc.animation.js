(function() {

    var _methods = {
        standartOutMapAction: function(npc) {
            if (npc.pos[0] > Core.canvas.width || npc.pos[0] < -150)
                npc.pos[0] = 0;
            if (npc.pos[1] > Core.canvas.height || npc.pos[1] < -150)
                npc.pos[1] = 0;
        },
        beforeMove: function(npc, to, dt) {
            if (Core.Helper.isset(npc.events) && Core.Helper.isset(npc.events.beforeMove)) {
                npc.events.beforeMove(npc, to, dt);
            }
        },
        standartMove: function(npc, to, dt) {
            _methods.beforeMove(npc, to, dt);
            switch (to) {
                case 'top':
                case 'up':
                    npc.sprite.level = npc.sprite.levels.top;
                    npc.pos[1] -= npc.speed * dt;
                    break;
                case 'bottom':
                case 'down':
                    npc.sprite.level = npc.sprite.levels.bottom;
                    npc.pos[1] += npc.speed * dt;
                    break;
                case 'left':
                    npc.sprite.level = npc.sprite.levels.left;
                    npc.pos[0] -= npc.speed * dt;
                    break;
                case 'right':
                    npc.sprite.level = npc.sprite.levels.right;
                    npc.pos[0] += npc.speed * dt;
                    break;
            }
            
            if (!CH.isset(npc.sprite) || !CH.isset(npc.sprite._index))
            {
                console.log('npc>>>');
                console.log(npc);
            }
            _methods.afterMove(npc, to, dt);
            Core.Sprite.update(npc.sprite, dt);
        },
        afterMove: function(npc, to, dt) {
            if (Core.Helper.isset(npc.events) && Core.Helper.isset(npc.events.afterMove)) {
                npc.events.afterMove(npc, to, dt);
            }

        }
    };

    Animation = {
        get: function(method) {
            return _methods[method];
        }
    };

    Core.Helper.addChild(Core.Npc, 'Animation', Animation);
})();