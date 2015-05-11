/**
 * Start game timer
 */
function startTimer() {
    setInterval(function() {
        newWave(10);
    }, 25000);
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