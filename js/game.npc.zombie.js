function createZombie(ctx) {
    var _self = {
        health: 100,
        tile: 'Zombie',
        resource: SPRITES.npc.zombie,
        sprite: null,
        spriteLevels: {
            bottom: 0,
            right: 1,
            left: 2,
            top: 3,
            die: 6
        },
        move: function(v) {
            switch (v) {
                case 'top':
                    _self.sprite.render(ctx, _self.spriteLevels.top);
                    break;
                case 'bottom':
                    _self.sprite.render(ctx, _self.spriteLevels.bottom);
                    break;
                case 'left':
                    _self.sprite.render(ctx, _self.spriteLevels.left);
                    break;
                case 'right':
                    _self.sprite.render(ctx, _self.spriteLevels.right);
                    break;
            }

        }
    };

    _self.sprite = new Core.Sprite(_self.resource, [0, 0], [64, 64], 7, [0, 1, 2, 3, 4, 5, 6, 7]);

    return {
        move: function(v) {
            _self.move(v);
        },
        update: function(dt) {
            _self.sprite.update(dt);
        }
    };
}