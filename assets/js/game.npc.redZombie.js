function createRedZombie(title, pos) {
    var uid = Core.Npc.add({
        title: title,
        health: 100,
        speed: 20,
        sprite: {
            resourceUrl: SPRITES.npc.zombieRed,
            frames: [0, 1, 2, 3, 4, 5, 6]
        },
        pos: CH.isset(pos) ? pos : [25, 25]
    });

    var zombie = Core.Npc.get(uid);

    // Add moving animation
    zombie.animation.move = function(to) {
        Core.Npc.Animation.get('standartMove')(zombie, to, Core.Time.dt());
    };

    var says = [
        'Argghhh!',
        'Braaainss...',
        'Whe-e brainssss...',
        'To be, or not to be...',
    ];

    // Add events
    zombie.events.afterMove = function(npc, to, dt) {
        // Out of map
        Core.Npc.Animation.get('standartOutMapAction')(npc);

        // Funy argghhh
        if (CH.randInt(0, 5000) === CH.randInt(0, 5000)) {
            var text = says[CH.randInt(0, says.length - 1)];
            Core.Render.addObject((1000 * 3), function() {
                Core.Render.renderBallon(npc.title + ': ' + text, npc.pos, Core.ctx);
            });

            console.info('%s: %s', npc.title, text);
        }
    };

    return uid;
}