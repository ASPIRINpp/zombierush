/**
 * Start game timer
 */
function startTimer() {
    newWave(Game.waveCount);
}


function createRoads() {
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

function newWave(count) {
    Game.waveCount += 2;
    document.getElementById('waveCount').innerHTML = Game.waveCount;
    var tmpFunction = function() {
        count--;
        Core.Roads.applyRoadToNpc(createNpc('Zombie'), 'road');
        if (count > 0) {
            Core.Time.setTimeout(tmpFunction, 1500);
        } else {
            Core.Time.setTimeout(function() { newWave(Game.waveCount); }, 10500);
        }
    };
    Core.Time.setTimeout(tmpFunction, 1500);
}

function createNpc(name) {
    var f = 'create' + name;
    return eval(f + '({pos: [276, -64]})');
}

/**
 * 
 * @returns {undefined}
 */
Game.pass = function() {
    Game.life--;
    if(Game.life === 0) {
        Game.pause();
        alert('Game over!');
    }
}