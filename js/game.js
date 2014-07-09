// Если ничего нет - возвращаем обычный таймер
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

var Game = {
    npc: {zombie1: null,
        zombieRed: null, },
    res: null,
    lastTime: null,
    updateLastTime: function() {
        this.lastTime = Date.now();
    }
};
//
//
var SPRITES = {
    terrain: {
        grass: '/sprites/terrain/grass.png',
    },
    npc: {
        zombie: '/sprites/npc/zombie.png',
        zombieRed: '/sprites/npc/zombierRed.png',
        marine: '/sprites/npc/marineEnd.png',
    }
};


Core.onReady(function() {

    Game.res = Core.Resource;

    console.log('>>>>>>>>Game loading...');
    Core.includeJs('/js/game.npc.marine.js');
    Core.includeJs('/js/game.npc.zombie.js');
    
    Core.includeJs('/js/input.js');

    // Create the canvas
    var content = document.getElementById('content');
    content.appendChild(Core.createCanvas());
    // End Create the canvas

    // Loading resouce
    Game.res.load([
        SPRITES.npc.zombie,
        SPRITES.npc.zombieRed,
        SPRITES.terrain.grass,
    ]);
    Game.res.onReady(function() {
        console.log('>>>>>>>>Game loading...done!');
        init();
    });





});



var sprite, lastTime, gameTime;
var npc = [];
function init() {
    Game['terrainPattern'] = Core.ctx.createPattern(Game.res.get(SPRITES.terrain.grass), 'repeat');

    npc.push(createZombie(Core.ctx, 'zombie1'));
//    npc.push(createMarine(Core.ctx, 'marine1'));

    main();


}
//

function main() {
    var now = Core.Time.now();
    var dt = Core.Time.dt();



    render();
    update(dt);

    Core.Time.sLT(now);
    requestAnimFrame(main);
}

function render() {
    Core.ctx.fillStyle = Game.terrainPattern;
    Core.ctx.fillRect(0, 0, Core.canvas.width, Core.canvas.height);
}


function update(dt) {

    handleInput(dt);



    var olNpc = npc;
    sorting();
    for (var k in npc)
    {
        renderEntity(npc[k]);
    }
    npc = olNpc;

}

function sorting() {
    var sortable = [];

    for (var k in npc)
        sortable.push([k, npc[k].getPos(1)])

    sortable.sort(function(a, b) {
        return a[1] - b[1]
    });

    var newNpc = [];
    for (var k in sortable) {
        newNpc.push(npc[sortable[k][0]])
    }

    npc = newNpc;
}

function renderEntity(npc) {

    Core.ctx.save();
    Core.ctx.translate(npc.getPos(0), npc.getPos(1));
    Core.Sprite.renderSprite(Core.ctx, npc.getSprite());
    Core.ctx.restore();
}


var focusZombie = 0;
var focusZombie2 = 0;

function handleInput(dt) {


    if (input.isDown('DOWN') || input.isDown('s')) {
        npc[focusZombie].move('bottom');
    }

    if (input.isDown('UP') || input.isDown('w')) {
        npc[focusZombie].move('top');
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        npc[focusZombie].move('left');
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        npc[focusZombie].move('right');
    }


    


    if (input.isDown('DOWN') || input.isDown('g')) {
        npc[focusZombie2].move('bottom');
    }

    if (input.isDown('UP') || input.isDown('t')) {
        npc[focusZombie2].move('top');
    }

    if (input.isDown('LEFT') || input.isDown('f')) {
        npc[focusZombie2].move('left');
    }

    if (input.isDown('RIGHT') || input.isDown('h')) {
        npc[focusZombie].move('right');
    }


}

