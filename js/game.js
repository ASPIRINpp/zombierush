

var SPRITES = {
    terrain: {
        grass: '/sprites/terrain/grass.png',
        dirt: '/sprites/terrain/dirt.png',
        grass2: '/sprites/terrain/grass2.png',
        grass3: '/sprites/terrain/grass3.png',
    },
    npc: {
        zombie: '/sprites/npc/zombie.png',
        zombieRed: '/sprites/npc/zombierRed.png',
        marine: '/sprites/npc/marineEnd.png',
    }
};

var Game = {
    res: null,
    lastTime: null,
    updateLastTime: function() {
        this.lastTime = Date.now();
    }
};


Core.onReady(function() {

    Game.res = Core.Resource;

    CC.grpC('Game loading ');
    console.log('>>>>>>>>Game loading...');
    Core.includeJs('/js/game.npc.zombie.js');
    Core.includeJs('/js/game.npc.redZombie.js');
    Core.includeJs('/js/input.js');

    // Create the canvas
    var content = document.getElementById('content');
    content.appendChild(Core.createCanvas());
    // End Create the canvas

    // Loading resouce
    Game.res.load([
        SPRITES.npc.zombie,
        SPRITES.npc.zombieRed,
        SPRITES.terrain.grass3,
    ]);

    Game.res.onReady(function() {
        console.log('>>>>>>>>Game loading...done!');
        CC.grpE();
        init();

        document.getElementById('content').onclick = function(e) {
            console.log('[' + e.layerX + ', ' + e.layerY + '],');
        };


    });




});


//var sprite, lastTime, gameTime;
//var npc = [];
var playerName;
function init() {
    var now = Core.Time.now();
    Core.Time.setLastTime(now);
    Core.Time.dt();
    Game['terrainPattern'] = Core.ctx.createPattern(Game.res.get(SPRITES.terrain.grass3), 'repeat');

    // Add paths roads
    Core.Roads.addPath('path1', [[30, 0], [30, 316], [310, 314], [310, 185], [435, 185], [435, 322], [691, 319]]);
    Core.Roads.addPath('path2', [[83, 50], [215, 50], [215, 350], [365, 350], [365, 131], [676, 130]]);
    Core.Roads.addPath('path3', [[668, 82], [657, 415], [430, 409], [453, 62], [329, 51], [321, 379], [128, 380]]);

    playerName = createZombie('Bob');
    console.info('Create player %s', playerName);

    Core.Roads.applyRoadToNpc(playerName, 'path2');
    Core.Roads.applyRoadToNpc(createZombie('Alice'), 'path1');

    main();

    var fpsOut = document.getElementById('fps');
    var npcCount = document.getElementById('npcCount');
    setInterval(function() 
    {
        fpsOut.innerHTML = Core.fps.current;
        npcCount.innerHTML = Core.Npc.getAll().length;
        
    }, 1000);


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

    // Draw road paths
    Core.Roads.drawPathRoad('path1', 'black');
    Core.Roads.drawPathRoad('path2', 'red');
    Core.Roads.drawPathRoad('path3', 'blue');

    Core.Render.go();
    Core.Roads.go();


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






function handleInput(dt) {

    var player = Core.Npc.get(playerName);

    if (input.isDown('DOWN') || input.isDown('s')) {
        player.animation.move('bottom');
    }

    if (input.isDown('UP') || input.isDown('w')) {
        player.animation.move('top');
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        player.animation.move('left');
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        player.animation.move('right');
    }

}

