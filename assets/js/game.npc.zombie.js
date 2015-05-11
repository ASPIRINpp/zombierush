function createZombie(options) {

    var defaultOptions = {
        title: 'zombie',
        cost: 5,
        health: 100,
        speed: 14,
        sprite: {
            resourceUrl: SPRITES.npc.zombie,
            frames: [0, 1, 2, 3, 4, 5, 6]
        },
        pos: [25, 25]
    };


    var says = [
        'Argghhh!',
        'Braaainss...',
        'Whe-e brainssss...',
        'To be, or not to be...'
    ], lastSays = [
        'За чтооо!?',
        'Суки...',
        'Мир жесток!',
        'Агррр',
        'И чего ты добился?',
        'Ай!',
        'Больно!!!',
        'Моя задница в огне',
    ];


    CH.merge(defaultOptions, options);

    var uid = Core.Npc.add(defaultOptions);
    var zombie = Core.Npc.get(uid);

    // Add moving animation
    zombie.animation.move = function(to) {
        Core.Npc.Animation.get('standartMove')(zombie, to, Core.Time.dt());
    };

    // Add die animation
    zombie.animation.die = function() {
        
        Game.sroce++;
        Game.money += zombie.cost;
        
        Core.Roads.detach(uid);
        zombie.health = 0;
        zombie.dies = true;
        Core.Npc.Animation.get('standartDie')(zombie, Core.Time.dt());
    };

    // Update events
    zombie.events.update = function() {
        
        if (zombie.health <= 0)
        {
            if (CH.isset(zombie.dies) === false || zombie.dies === false) 
                zombie.animation.die();
            else
            if (zombie.sprite.done === true)
                Core.Npc.destroy(uid);
        }

    };

    // Before die event
    zombie.events.beforeDie = function(npc, dt) {
        if (CH.randInt(0, 15000) === CH.randInt(0, 15000)) {
            var text = lastSays[CH.randInt(0, lastSays.length - 1)];
            Core.Render.addObject((1000 * 3), function() {
                Core.Render.renderBallon(npc.title + ': ' + text, npc.pos, Core.ctx);
            });
        }
    };

    // Destroy event
    zombie.events.destroy = function() {
        
    };
    
    zombie.events.damage = function(hp) {
        zombie.health -= hp;
        Core.Render.addObject((1000 * 2), function() {
            Core.Render.renderBallon(zombie.title + ': -'+hp, zombie.pos, Core.ctx);
        });
    };


    // Add events
    zombie.events.afterMove = function(npc, to, dt) {
        // Out of map
        Core.Npc.Animation.get('standartOutMapAction')(npc);

        // Funy argghhh
        if (CH.randInt(0, 15000) === CH.randInt(0, 15000)) {
            var text = says[CH.randInt(0, says.length - 1)];
            Core.Render.addObject((1000 * 3), function() {
                Core.Render.renderBallon(npc.title + ': ' + text, npc.pos, Core.ctx);
            });
        }
    };

    return uid;
}