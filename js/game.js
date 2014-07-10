

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

var path2 = [
    [83, 50],
    [215, 50],
    [215, 350],
    [365, 350],
    [365, 131],
    [676, 130],
];
var path1 = [
    [30, 0],
    [30, 316],
    [310, 314],
    [310, 185],
    [435, 185],
    [435, 322],
    [691, 319]
];
var path3 = [
    [668, 82],
    [657, 415],
    [430, 409],
    [453, 62],
    [329, 51],
    [321, 379],
    [128, 380]
];

//var sprite, lastTime, gameTime;
//var npc = [];
var playerName;
function init() {
    var now = Core.Time.now();
    Core.Time.setLastTime(now);
    Core.Time.dt();
    Game['terrainPattern'] = Core.ctx.createPattern(Game.res.get(SPRITES.terrain.grass3), 'repeat');

//    npc.push(createZombie(Core.ctx, 'zombie1'));
//    npc.push(createZombie(Core.ctx, 'zombie2'));
//    npc.push(createZombie(Core.ctx, 'zombie3'));
//    npc.push(createMarine(Core.ctx, 'marine1'));
    playerName = createZombie('Bob');
    console.info('Create player %s', playerName);

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

    Core.Render.go();

//    updateEntities(dt);


//    var olNpc = npc;
//    sorting();
//    for (var k in npc)
//    {
//        renderEntity(npc[k]);
//    }
//    npc = olNpc;

}

function renderEntity(npc) {

    Core.ctx.save();
    Core.ctx.translate(npc.getPos(0), npc.getPos(1));
    Core.Sprite.renderSprite(Core.ctx, npc.getSprite());
    Core.ctx.restore();
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





function drawPathLines(path, color) {

    for (var k in path)
    {
        Core.ctx.beginPath();
        if (typeof path[k - 1] !== 'undefined')
            Core.ctx.moveTo(path[k - 1][0], path[k - 1][1]);
        else
            Core.ctx.moveTo(path[k][0], path[k][1]);

        Core.ctx.lineTo(path[k][0], path[k][1]);
        Core.ctx.strokeStyle = color;
        Core.ctx.stroke();
    }

}
var pathNpc = {};
function updateEntitie(npcId, path) {
//    var npcId = 0;
    if (typeof pathNpc[npcId] === 'undefined')
        pathNpc[npcId] = 0;
//    
//    console.log(Math.floor(npc[npcId].getPos(0)), Math.floor(npc[npcId].getPos(1)));
    if (pathNpc[npcId] != -1)
    {
        var px = Math.floor(npc[npcId].getPos(0)) + Math.floor(npc[npcId].getSprite().size[0] / 2);
        var py = Math.floor(npc[npcId].getPos(1)) + npc[npcId].getSprite().size[1] - 5;


        switch (true) {

            case (py == path[pathNpc[npcId]][1] && px == path[pathNpc[npcId]][0]):
                if (typeof path[pathNpc[npcId] + 1] !== 'undefined')
                {
                    CC.grpC('Getted point ' + npcId);
                    console.log('NPC pos[' + pathNpc[npcId] + ']:');
                    console.log(px, py);
                    console.log('NPC ideal pos:');
                    console.log(path[pathNpc[npcId]]);
                    CC.grpE('');

                    pathNpc[npcId]++;

                }
                else
                {
//                    pathNpc[npcId] = -1;
                    pathNpc[npcId] = 0;
                }

                break;
            case (px < path[pathNpc[npcId]][0]):
                npc[npcId].move('right');
                break;
            case (px > path[pathNpc[npcId]][0]):
                npc[npcId].move('left');
                break;
            case (py < path[pathNpc[npcId]][1]):
                npc[npcId].move('bottom');
                break;
            case (py > path[pathNpc[npcId]][1]):
                npc[npcId].move('top');
                break;
        }
    }
}

function updateEntities(dt) {
    drawPathLines(path1, 'blue');
    drawPathLines(path2, 'red');
    drawPathLines(path3, 'yellow');
    updateEntitie(0, path1);
    updateEntitie(1, path2);
    updateEntitie(2, path3);
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

