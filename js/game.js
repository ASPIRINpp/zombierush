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
    }
};


Core.onReady(function() {

    Game.res = Core.Resource;

    console.log('>>>>>>>>Game loading...');
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
//    Game.npc.zombie1 = new createZombie(Core.ctx, 'zombie1');
    Game['terrainPattern'] = Core.ctx.createPattern(Game.res.get(SPRITES.terrain.grass), 'repeat');


    // Render terrain
//    Core.ctx.fillStyle = Game.terrainPattern;
//    Core.ctx.fillRect(0, 0, Core.canvas.width, Core.canvas.height);

//    sprite = new Core.Sprite(SPRITES.npc.zombie, [0, 0], [64, 64], [0, 1, 2, 3, 4, 5, 6]);

    npc.push(createZombie(Core.ctx, 'zombie1'));
//    npc.push(createZombie(Core.ctx, 'zombie2'));
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
    for (var k in npc)
    {
        renderEntity(npc[k]);

    }

}

function renderEntity(npc) {

    Core.ctx.save();
    Core.ctx.translate(npc.getPos(0), npc.getPos(1));
    Core.Sprite.renderSprite(Core.ctx, npc.getSprite());
    Core.ctx.restore();
}

//function updateEntities(dt) {
//
//
//    // Update all the enemies
//    for (var i = 0; i < Game.npc.length; i++) {
////        Game.npc[i].pos[0] -= enemySpeed * dt;
//        Game.npc[i].incPosX(dt);
//        Game.npc[i].sprite.update(dt);
//
////        // Remove if offscreen
////        if (Game.npc[i].pos[0] + Game.npc[i].sprite.size[0] < 0) {
////            Game.npc.splice(i, 1);
////            i--;
////        }
//    }
//}
//// Draw everything

//;
//
//function renderEntities(list) {
//    for (var i = 0; i < list.length; i++) {
//        renderEntity(list[i]);
//    }
//}
//

//// Reset game to original state
//function reset() {
////      player.pos = [50, canvas.height / 2];
//}
//;

function handleInput(dt) {
    if (input.isDown('DOWN') || input.isDown('s')) {
        npc[0].move('bottom');
    }

    if (input.isDown('UP') || input.isDown('w')) {
        npc[0].move('top');
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        npc[0].move('left');
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        npc[0].move('right');
    }


}

