/**
 * Directories
 */
var DIR = {
    assets:'/assets/',
    sprites: '/assets/sprites/',
    js: '/assets/js/'
}

/**
 * Sprites object
 */
var SPRITES = {
    terrain: {
        grass: DIR.sprites+'terrain/grass.png',
        dirt: DIR.sprites+'terrain/dirt.png',
        grass2: DIR.sprites+'terrain/grass2.png',
        grass3: DIR.sprites+'terrain/grass3.png',
        grass4: DIR.sprites+'terrain/grass4.png'
    },
    road: DIR.sprites+'roads/map1.png',
    npc: {
        zombie: DIR.sprites+'npc/zombie.png',
        tower: DIR.sprites+'npc/tower.png',
        zombieRed: DIR.sprites+'npc/zombierRed.png',
        marine: DIR.sprites+'npc/marineEnd.png'
    }
};

/**
 * Game object
 */
var Game = {
    res: null,
    sroce: 0,
    money: 500,
    onclick: function(){},
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
    Core.includeJs(DIR.js+'game.functions.main.js');
    Core.includeJs(DIR.js+'game.functions.menu.js');
    Core.includeJs(DIR.js+'game.npc.zombie.js');
    Core.includeJs(DIR.js+'game.build.tower.js');
    Core.includeJs(DIR.js+'game.npc.redZombie.js');
    Core.includeJs(DIR.js+'input.js');

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

    // Game ready
    Game.res.onReady(function() {
        console.log('>>>>>>>>Game loading...done!');
        CC.grpE();
        Game.init();


        // Menu Events
        document.getElementById('content').onclick = function(e) {
            //console.log('[' + e.layerX + ',' + e.layerY + ']');
            Game.onclick([e.layerX, e.layerY]);
        };
        document.getElementById('killAll').onclick = function(e) {
            killAll();
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