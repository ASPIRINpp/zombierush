
function loader() {
    var _self = {
        _id: 'loading',
        _check: function() {
            return (document.getElementById(_self._id) !== null);
        },
        _show: function() {
            document.getElementById(_self._id).style.display = 'block';
//            $(_self._id).show();
        },
        _hide: function() {
            document.getElementById(_self._id).style.display = 'none';
//            $(_self._id).hide();
        }
    };

    return {
        show: function() {
            _self._show();
        },
        hide: function() {
            _self._hide();
        }
    };
}

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
        tower: '/sprites/npc/tower.png',
        zombieRed: '/sprites/npc/zombierRed.png',
        marine: '/sprites/npc/marineEnd.png',
    }
};

var Game = {
    res: null,
    sroce: 0,
    money: 500,
    onclick: killZombie

};

var pathBuilder = new Array();

Core.onReady(function() {

    Game.res = Core.Resource;

    CC.grpC('Game loading ');
    console.log('>>>>>>>>Game loading...');
    Core.includeJs('/js/game.npc.zombie.js');
    Core.includeJs('/js/game.build.tower.js');
    Core.includeJs('/js/game.npc.redZombie.js');
    Core.includeJs('/js/input.js');

    // Create the canvas
    var content = document.getElementById('content');
    content.appendChild(Core.createCanvas());
    // End Create the canvas

    // Loading resouce
    Game.res.load([
        SPRITES.npc.tower,
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
            Game.onclick([e.layerX, e.layerY]);
            //checkCollision([e.layerX, e.layerY]);
        };

//        document.getElementById('addZombie').onclick = function(e) {
//            addMoreZombies(1);
//        };

        //       document.getElementById('waveZombie').onclick = function(e) {
//            newWave(10);
        //};
        loader().hide();
    });
    document.getElementById('killAll').onclick = function(e) {
        killAll();
    };
    
    document.getElementById('startGame').onclick = function(e) {
        startTimer();
        this.style.display = 'none';
    };
});

function startTimer() {
    setInterval(function() {
        addMoreZombies(10);
    }, 5000);
}

function killAll() {
    if (Game.money >= 500) {
        Game.money -= 500;
        var npcs = Core.Npc.getAll();
        for (var k in npcs) {
            npcs[k].animation.die();
        }
        console.log("kill all done!")
    } else
        console.error("Need more money!");
}

/**
 * 
 * @param {type} pos
 * @returns {undefined}
 */
function checkCollision(pos)
{
//    var npcs = Core.Npc.getAll();
//    for (var k in npcs) {
//        var areaX = [npcs[k].pos[0], npcs[k].pos[0] + npcs[k].sprite.size[0]],
//                areaY = [npcs[k].pos[1], npcs[k].pos[1] + npcs[k].sprite.size[1]];
//        if ((pos[0] >= areaX[0] && pos[0] <= areaX[1]) && (pos[1] >= areaY[0] && pos[1] <= areaY[1]))
//        {
//            if (!CH.isset(npcs[k].dies))
//                npcs[k].animation.die();
//            return;
//        } else {
    buildTower(pos);
//        }
//    }
}

function createRandomPath(steps, size) {

    var Helper = CH,
            path = [],
            steps = Helper.randInt(steps[0], steps[1]),
            uid = Helper.unquid();

    console.log(path)
    console.log(steps)

    for (var i = 0; i < steps; i++) {
        path.push([Helper.randInt(size[0][0], size[0][1]), Helper.randInt(size[1][0], size[1][1])]);
    }
    ;

    Core.Roads.addPath(uid, path);

    return uid;
}

function killZombie(pos) {
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

function putZombie(pos) {

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
window.cc = []
function update(dt) {
    var CoreNpc = Core.Npc,
            Helper = CH,
            CoreRoads = Core.Roads;
    Core.Terrain.go();

    // Draw road paths
    //var colors = ['red', 'black', 'blue'];
    //var roads = CoreRoads.getAllIds();
    //console.log(roads);
    //for (var i = roads.length - 2; i >= 0; i=i-2) {
    //    CoreRoads.drawPathRoad(roads[i], colors[CH.randInt(0, 1)]);      
    //    if (window.cc.indexOf(roads[i]) < 0) {
    //        console.log(roads[i])
    //        window.cc.push(roads[i])
    //    }

    //}

//    Core.Roads.drawPathRoad('path1', 'black');
//    Core.Roads.drawPathRoad('path2', 'red');
//    Core.Roads.drawPathRoad('path3', 'blue');

    CoreNpc.go();
    Core.Render.go();
    CoreRoads.go();

    var units = CoreNpc.getAll();

    for (var k = 0, count = units.length; k < count; k++) {
        if (Helper.isset(units[k]) && Helper.isset(units[k].events.update))
            units[k].events.update();
    }

}

function main() {
    var CoreTime = Core.Time,
            now = CoreTime.now(),
            dt = CoreTime.dt();

    update(dt);

    CoreTime.sLT(now);
    requestAnimFrame(main);
}

function createRoads() {
//    Core.Roads.addPath('path1', [[30, 80], [30, 316], [310, 314], [310, 185], [435, 185], [435, 322], [691, 319]]);
//    Core.Roads.addPath('path2', [[83, 80], [215, 50], [215, 350], [365, 350], [365, 131], [676, 130]]);
//    Core.Roads.addPath('path3', [[668, 82], [657, 415], [430, 409], [453, 62], [329, 51], [321, 379], [128, 380]]);
    return false
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
    var fpsOut = document.getElementById('fps'),
            npcCount = document.getElementById('npcCount'),
            money = document.getElementById('moneyCount'),
            kills = document.getElementById('killsCount');



    setInterval(function()
    {
        fpsOut.innerHTML = Core.fps.current;
        npcCount.innerHTML = Core.Npc.getAll().length;
        money.innerHTML = Game.money;
        kills.innerHTML = Game.sroce;

    }, 1000);
}

function addMoreZombies(count) {
    count = CH.isset(count) ? count : 50;

    for (var i = 0; i < count; i++) {
        var path = createRandomPath([5, 10], [[0, 800], [0, 600]]);
        var uid = createZombie({pos: [CH.randInt(0, Core.canvas.width), CH.randInt(0, Core.canvas.height)]});
        Core.Roads.applyRoadToNpc(uid, path);
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