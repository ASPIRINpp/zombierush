

var SPRITES = {
    terrain: {
        grass: '/sprites/terrain/grass.png',
        dirt: '/sprites/terrain/dirt.png',
        grass2: '/sprites/terrain/grass2.png',
        grass3: '/sprites/terrain/grass3.png',
        grass4: '/sprites/terrain/grass4.png',
    },
    road: '/sprites/roads/map1.png',
    npc: {
        zombie: '/sprites/npc/zombie.png',
        zombieRed: '/sprites/npc/zombierRed.png',
        marine: '/sprites/npc/marineEnd.png',
    }
};

var Game = {
    res: null,
    sroce: 0,
    money: 500,
};

var pathBuilder = new Array();

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
        SPRITES.terrain.grass4,
        SPRITES.road
    ]);

    Game.res.onReady(function() {
        console.log('>>>>>>>>Game loading...done!');
        CC.grpE();
        init();


        // Menu Events
        document.getElementById('content').onclick = function(e) {
            console.log('[' + e.layerX + ',' + e.layerY + ']');
            pathBuilder.push([e.layerX, e.layerY]);
            checkCollision([e.layerX, e.layerY]);
        };

//        document.getElementById('addZombie').onclick = function(e) {
//            addMoreZombies(1);
//        };
        
        document.getElementById('waveZombie').onclick = function(e) {
            newWave(10);
        };

    });

});

/**
 * 
 * @param {type} pos
 * @returns {undefined}
 */
function checkCollision(pos)
{
    var npcs = Core.Npc.getAll();
    for (var k in npcs) {
        var areaX = [npcs[k].pos[0], npcs[k].pos[0] + npcs[k].sprite.size[0]],
                areaY = [npcs[k].pos[1], npcs[k].pos[1] + npcs[k].sprite.size[1]];
        if ((pos[0] >= areaX[0] && pos[0] <= areaX[1]) && (pos[1] >= areaY[0] && pos[1] <= areaY[1]))
        {
            if (!CH.isset(npcs[k].dies))
                npcs[k].animation.die();
            return;
        }
    }
}


//var playerName;
function init() {

    // Set started times
    var now = Core.Time.now();
    Core.Time.setLastTime(now);

    // Set terrain pattern 
    Core.Terrain.createPattern(SPRITES.terrain.grass4);
    Core.Terrain.addLayer(SPRITES.road, [0, 0]);

    // Add paths roads
    createRoads();
    // Start game
    main();
    // Render menu
    renderMenu();

}

function main() {
    var now = Core.Time.now();
    var dt = Core.Time.dt();

    update(dt);

    Core.Time.sLT(now);
    requestAnimFrame(main);
}

function createRoads() {
//    Core.Roads.addPath('path1', [[30, 80], [30, 316], [310, 314], [310, 185], [435, 185], [435, 322], [691, 319]]);
//    Core.Roads.addPath('path2', [[83, 80], [215, 50], [215, 350], [365, 350], [365, 131], [676, 130]]);
//    Core.Roads.addPath('path3', [[668, 82], [657, 415], [430, 409], [453, 62], [329, 51], [321, 379], [128, 380]]);
    Core.Roads.addPath('road', [
        
        [276, 0],
        [278, 366],
        [495, 366],
        [497, 243],
        [83, 241],
        [84, 556],
        [625, 557],
        [629, 112],
        [800, 111]
    ]);
}

function renderMenu() {
    var fpsOut = document.getElementById('fps');
    var npcCount = document.getElementById('npcCount');

    setInterval(function()
    {
        fpsOut.innerHTML = Core.fps.current;
        npcCount.innerHTML = Core.Npc.getAll().length;

    }, 1000);
}

function addMoreZombies(count) {
    count = CH.isset(count) ? count : 50;

    var pathes = ['road'];

    for (var i = 0; i < count; i++) {
        var uid = createZombie({pos: [CH.randInt(0, Core.canvas.width), CH.randInt(0, Core.canvas.height)]});
        Core.Roads.applyRoadToNpc(uid, pathes[CH.randInt(0, pathes.length - 1)]);
    }
}

function newWave(count) {
    var tmpFunction = function() {
        console.log(count);
        count--;

        Core.Roads.applyRoadToNpc(createNpc('Zombie'), 'road');

        if (count > 0)
            setTimeout(tmpFunction, 1500);
    }
    setTimeout(tmpFunction, 1500)

}

function createNpc(name) {
    var f = 'create' + name;
    return eval(f + '({pos: [276, -64]})');
}

function update(dt) {
    Core.Terrain.go();

    // Draw road paths
//    Core.Roads.drawPathRoad('road', 'black');
//    Core.Roads.drawPathRoad('path1', 'black');
//    Core.Roads.drawPathRoad('path2', 'red');
//    Core.Roads.drawPathRoad('path3', 'blue');

    Core.Npc.go();
    Core.Render.go();
    Core.Roads.go();
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

