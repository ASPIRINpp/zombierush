/**
 * Directories
 */
var DIR = {
    assets: '/assets/',
    sprites: '/assets/sprites/',
    js: '/assets/js/'
}

/**
 * Sprites object
 */
var SPRITES = {
    terrain: {
        grass: DIR.sprites + 'terrain/grass.png',
        dirt: DIR.sprites + 'terrain/dirt.png',
        grass2: DIR.sprites + 'terrain/grass2.png',
        grass3: DIR.sprites + 'terrain/grass3.png',
        grass4: DIR.sprites + 'terrain/grass4.png'
    },
    road: DIR.sprites + 'roads/map1.png',
    npc: {
        zombie: DIR.sprites + 'npc/zombie.png',
        tower: DIR.sprites + 'npc/tower.png',
        towerR: DIR.sprites + 'npc/towerR.png',
        zombieRed: DIR.sprites + 'npc/zombierRed.png',
        marine: DIR.sprites + 'npc/marineEnd.png'
    }
};

/**
 * Game object
 */
var Game = {
    res: null,
    // Count of max pass zombies
    life: 20,
    // Count of zomies kills
    sroce: 0,
    // Money
    money: 450,
    // Click on canvas
    onclick: null,
    // Game pause
    pause: false,
    // Mouse pos
    mouse: [0,0],
    // Waves count
    wave: 0,
    // Wave zombies count
    waveCount: 10,
    // Init game
    init: function() {
        // Set started times
        var now = Core.Time.now();
        Core.Time.setLastTime(now);

        // Set terrain pattern 
        Core.Terrain.createPattern(SPRITES.terrain.grass4);
        Core.Terrain.addLayer(SPRITES.road, [0, 0]);

        createRoads();
        // Start game
        main();
        // Render menu
        renderMenu();
    }
};

/**
 * Game on ready
 */
Core.onReady(function() {
    // Set resource
    Game.res = Core.Resource;

    // Include game js
    CC.grpC('Game loading ');
    console.log('>>>>>>>>Game loading...');
    Core.includeJs(DIR.js + 'game.functions.main.js');
    Core.includeJs(DIR.js + 'game.functions.menu.js');
    Core.includeJs(DIR.js + 'game.npc.zombie.js');
    Core.includeJs(DIR.js + 'game.build.tower.js');
    Core.includeJs(DIR.js + 'game.build.towerR.js');
    Core.includeJs(DIR.js + 'game.npc.redZombie.js');
    Core.includeJs(DIR.js + 'input.js');

    // Create the canvas
    var content = document.getElementById('content'),
        canvas = Core.createCanvas('gameCanvas');
    content.appendChild(canvas);
    // End Create the canvas

    // Loading resouce
    Game.res.load([
        SPRITES.npc.tower,
        SPRITES.npc.towerR,
        SPRITES.npc.zombie,
        SPRITES.npc.zombieRed,
        SPRITES.terrain.grass4,
        SPRITES.road
    ]);

    // Game ready
    Game.res.onReady(function() {
        console.log('>>>>>>>>Game loading...done!');
        CC.grpE();
        Game.init();


        // Menu Events
        canvas.onclick = function(e) {
            if (Game.onclick != null) {
                Game.onclick([e.layerX, e.layerY]);
                Game.onclick = null;
            }
            //Game.onclick([e.layerX, e.layerY]);
        };
        canvas.onmousemove = function(e) {
                Game.mouse = [e.layerX, e.layerY];
        };
        document.getElementById('bt1').onclick = function(e) {
            if (Game.money >= 200) {
                Game.onclick = buildTower;
            }
        };
        document.getElementById('bt2').onclick = function(e) {
            if (Game.money >= 300) {
                Game.onclick = buildTowerR;
            }
        };
        document.getElementById('btPause').onclick = function(e) {
            if (Game.pause) {
                Game.pause = false;
                this.innerHTML = 'Pause';
            } else {
                Game.pause = true;   
                this.innerHTML = 'Start';
            }
        };
        document.getElementById('startGame').onclick = function(e) {
            startTimer();
            this.style.display = 'none';
            return false;
        };

        loader().hide();
    });
});


function update(dt) {
    // Check pause
    if(Game.pause) {
        return true;
    }
    
    Core.Time.updateTimers();
    var CoreNpc = Core.Npc,
            Helper = CH,
            CoreRoads = Core.Roads;
    Core.Terrain.go();

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

/**
 * Game paused on window blur
 * @returns {undefined}
 */
window.onblur = function() {
//    Game.pause = true;   
//    document.getElementById('btPause').innerHTML = 'Start';
};