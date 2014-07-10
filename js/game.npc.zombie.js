function createZombie(title) {
    var uid = Core.Npc.add({
        title: title,
        health: 100,
        speed: 14,
        sprite: {
            resourceUrl: SPRITES.npc.zombie,
            frames: [0, 1, 2, 3, 4, 5, 6]
        },
        pos: [25, 25]
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
        if (CH.randInt(0, 500) === CH.randInt(0, 500)) {
            var text = says[CH.randInt(0, says.length-1)];
            Core.Render.addObject((1000 * 3), function() {
                Core.Render.renderBallon(npc.title + ': ' + text, npc.pos, Core.ctx);
            });

            console.info('%s: %s', npc.title, text);
        }
    };

    return uid;
}