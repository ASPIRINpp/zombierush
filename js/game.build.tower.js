function buildTower(pos) {
    pos[1] -= 16;
    pos[0] -= 16;

    var uid = Core.Npc.add({
        title: 'tower',
        health: 100,
        speed: 1,
        radius: 100,
        params:{
            attack: 50,
            speed: 5,
        },
        sprite: {
            size: [32, 32],
            resourceUrl: SPRITES.npc.tower,
            frames: [0, 1, 2, 3, 4, 5, 6, 7],
            once: false
        },
        pos: pos
    });

    var tower = Core.Npc.get(uid);

    window.lastTower = tower;

    // Add moving animation
    tower.animation.move = function(to) {
        switch (to) {
            case 'top':
            case 'up':
                tower.sprite.speed = 0;
                tower.sprite.fr = 0;
                break;
            case 'bottom':
            case 'down':
                tower.sprite.speed = 0;
                tower.sprite.fr = 4;
                break;
            case 'left':
                tower.sprite.speed = 0;
                tower.sprite.fr = 6;
                break;
            case 'right':
                tower.sprite.speed = 0;
                tower.sprite.fr = 2;
                break;
            case 'tright':
                tower.sprite.speed = 0;
                tower.sprite.fr = 1;
                break;
            case 'bright':
                tower.sprite.speed = 0;
                tower.sprite.fr = 3;
                break;
            case 'bleft':
                tower.sprite.speed = 0;
                tower.sprite.fr = 5;
                break;
            case 'tleft':
                tower.sprite.speed = 0;
                tower.sprite.fr = 7;
                break;
            case 'free':
                tower.sprite.speed = 1;
                break;
        }
    };

    // Update
    tower.events.update = function() {
        tower.render.radius();

        var zombies = Core.Npc.getAll();
        for (var k in zombies)
        {
            if (zombies[k].title === 'zombie')
            {
                var Xz = zombies[k].pos[0] + zombies[k].sprite.size[0]/2;
                var Yz = zombies[k].pos[1] + zombies[k].sprite.size[1]/2;

                var Xt = tower.pos[0];
                var Yt = tower.pos[1];
                var Rt = tower.radius;

                var L = Math.sqrt((Xt - Xz)*(Xt - Xz) + (Yt - Yz)*(Yt - Yz));

                var in_radius = (L <= Rt);
                if (in_radius)
                {                   
                    zombies[k].health -= tower.strength;
                }
            }
        }

        // Funy argghhh
        if (CH.randInt(0, 5000) === CH.randInt(0, 5000)) {
            var text = says[CH.randInt(0, says.length - 1)];
            Core.Render.addObject((1000 * 3), function() {
                Core.Render.renderBallon(tower.title + ': ' + text, tower.pos, Core.ctx);
            });
        }
    };

    tower.render = {};
    tower.render.radius = function() {
        // translate context

        // draw circle which will be stretched into an oval
        Core.ctx.beginPath();
        Core.ctx.arc(tower.pos[0] + 16, tower.pos[1] + 16, tower.radius, 0, 2 * Math.PI, false);
        Core.ctx.lineWidth = 1;
        Core.ctx.strokeStyle = '#8ED6FF';
        Core.ctx.stroke();
    }

    var says = [
        'Tratatata!',
        'Die! Die! Die!',
        'Узрите свою ничтожность и отступайте!',
        'Жалость — признак слабости',
        'В пламя битвы! К горнилу войны!',
        'Все за Императора!',
        'Вперед, в рукопашную!',
        'Мы умрем стоя!',
        'Наконец-то война!',
        'Умри! Умри! Умри!',
        'Пади перед моим гневом!',
        'Я очищу нечистое!',
        'Я очищу мир от скверны!',
        'Вера — мой щит! Ярость — мой меч!',
        'Страдания! Вот участь грешников!',
        'Калечь! Убивай! Жги!',
    ];

    return uid;
}