function createZombie(ctx, uid) {

    // UID
    uid = (typeof uid === 'undefined') ? Math.random() : uid;

    var _self = {
        health: 100,
        speed: 14,
        tile: 'Zombie',
        resource: SPRITES.npc.zombie,
        pos:[0,0],
        sprite: null,
        spriteLevels: {
            bottom: 0,
            right: 1,
            left: 2,
            top: 3,
            die: 6
        },
        move: function(v) {
            var dt = Core.Time.dt();
            switch (v) {
                case 'top':
                    _self.sprite.level = _self.spriteLevels.top;
                    _self.pos[1] -= _self.speed * dt;
                    
                    break;
                case 'bottom':
                    _self.sprite.level = _self.spriteLevels.bottom;
                    _self.pos[1] += _self.speed * dt;
                    break;
                case 'left':
                    _self.sprite.level = _self.spriteLevels.left;
                    _self.pos[0] -= _self.speed * dt;
                    break;
                case 'right':
                    _self.sprite.level = _self.spriteLevels.right;
                    _self.pos[0] += _self.speed * dt;
                    break;
            }
            Core.Sprite.updateSprite(_self.sprite,dt);
            

        }
    };

    // Create sprite data
    _self.sprite = Core.Sprite.createSprite(_self.resource, [0, 0], _self.spriteLevels, [64, 64], _self.speed, [0, 1, 2, 3, 4, 5, 6]);

    return {
        move: function(v) {
            _self.move(v);
        },
        update: function(dt) {
//            _self.sprite.updateSprite(dt);
        },
        getPos: function(k) {
            return (k !== 'undefined') ? _self.pos[k] : _self.pos;
        },
        setPos: function(pos) {
            _self.pos = pos;
        },
        getSprite: function() {
            return _self.sprite;
        },
        render: function() {
            _self.sprite.render(Core.ctx, _self.spriteLevels.top);
        }

    };
}