function createZombie(options) {

    var defaultOptions = {
        level: 1,
        title: 'zombie',
        cost: 15,
        maxHealth: 100,
        health: 100,
        speed: 24,
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

    // Level change
    defaultOptions.health += Math.ceil(defaultOptions.health * (defaultOptions.level * 30) / 100);
    defaultOptions.maxHealth += Math.ceil(defaultOptions.maxHealth * (defaultOptions.level * 30) / 100);
    defaultOptions.cost += Math.ceil(defaultOptions.cost * (defaultOptions.level * 30) / 100);

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
        var mousePos = Game.mouse,
            npcPos = zombie.pos;
        if ((npcPos[0] <= mousePos[0] && npcPos[0] + 64 >= mousePos[0])
                && (npcPos[1] <= mousePos[1] && npcPos[1] + 64 >= mousePos[1])) {
                zombie.render.health();
        }
        
        if (zombie.health <= 0)
        {
            if (CH.isset(zombie.dies) === false || zombie.dies === false) 
                zombie.animation.die();
            else
            if (zombie.sprite.done === true)
                Core.Npc.destroy(uid);
        }

    };

    /**
     * Before die event
     * @param {type} npc
     * @param {type} dt
     * @returns {undefined}
     */
    zombie.events.beforeDie = function(npc, dt) {
        if (CH.randInt(0, 15000) === CH.randInt(0, 15000)) {
            var text = lastSays[CH.randInt(0, lastSays.length - 1)];
            Core.Render.addObject((1000 * 3), function() {
                Core.Render.renderBallon(npc.title + ': ' + text, npc.pos, Core.ctx);
            });
        }
    };

    
    /**
     * Road end event
     * @returns {undefined}
     */
    zombie.events.roadEnd = function() {
        Game.pass();
        Core.Npc.destroy(uid);
    };
    
    /**
     * Event before destroy npc object
     * @returns {undefined}
     */
    zombie.events.destroy = function() {
        
    };
    
    /**
     * Damage for npc
     * @param {type} hp
     * @returns {undefined}
     */
    zombie.events.damage = function(hp) {
        zombie.health -= hp;
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
    
    zombie.render = {};
    zombie.render.health = function () {
        var h = 4, 
                w = 32, 
                precent = Math.ceil(zombie.health*100/zombie.maxHealth),
                npcPos = zombie.pos;
        Core.ctx.beginPath();
        Core.ctx.fillStyle = "#000000";
        Core.ctx.fillRect(npcPos[0]+16, npcPos[1], w, h);
        Core.ctx.fillStyle = "#FF0000";
        Core.ctx.fillRect(npcPos[0]+16, npcPos[1], w * precent / 100, h);
    };

    return uid;
}