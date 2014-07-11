(function() {

    /**
     * @type Array of roads path
     */
    var _roads = [];

    /**
     * @type Array
     */
    var _roadsKeys = [];

    var _npcRoads = {};

    function addRoad(uid, road) {
        var index = (_roads.push(road) - 1);
        _roadsKeys.push(uid);
        _roadsKeys.push(index);
    }

    function getRoad(uid) {
        var index = _roadsKeys[_roadsKeys.indexOf(uid) + 1];
        return _roads[index];
    }

    /**
     * Draw lines by path
     * @param {type} path
     * @param {type} color
     * @returns {undefined}
     */
    function drawPathLines(path, color) {

        for (var k in path)
        {
            Core.ctx.beginPath();
            if (typeof path[k - 1] !== 'undefined')
                Core.ctx.moveTo(path[k - 1][0], path[k - 1][1]);
            else
                Core.ctx.moveTo(path[k][0], path[k][1]);

            Core.ctx.lineWidth = 0.5;
            Core.ctx.lineTo(path[k][0], path[k][1]);
            Core.ctx.strokeStyle = color;
            Core.ctx.stroke();
        }

    }


    function moveNPC(npcUid, path) {

        var NPC = Core.Npc.get(npcUid), road = getRoad(path.uid);

        if (path.pos != -1)
        {
            var px = Math.floor(NPC.pos[0]) + Math.floor(NPC.sprite.size[0] / 2);
            var py = Math.floor(NPC.pos[1]) + NPC.sprite.size[1] - 5;


            switch (true) {

                case (py == road[path.pos][1] && px == road[path.pos][0]):
                    if (typeof road[path.pos + 1] !== 'undefined')
                    {
                        Core.Console.grpC('Checkpoint road: ' + npcUid);
                        Core.Console.log(npcUid);
                        Core.Console.log('NPC pos[' + path.pos + ']:');
                        Core.Console.log(px, py);
                        Core.Console.log('NPC ideal pos:');
                        Core.Console.log(road[path.pos]);
                        Core.Console.groupEnd();

                        path.pos++;
                    }
                    else
                    {
                        //path.pos = -1;
                        path.pos = 0;
                    }

                    break;
                case (px < road[path.pos][0]):
                    NPC.animation.move('right');
                    break;
                case (px > road[path.pos][0]):
                    NPC.animation.move('left');
                    break;
                case (py < road[path.pos][1]):
                    NPC.animation.move('down');
                    break;
                case (py > road[path.pos][1]):
                    NPC.animation.move('up');
                    break;
            }

        }
    }

    Roads = {
        addPath: function(uid, path) {
            addRoad(uid, path);
        },
        get: function(uid) {
            return getRoad(uid);
        },
        applyRoadToNpc: function(npcId, roadId) {
            _npcRoads[npcId] = {uid: roadId, pos: 0};
        },
        go: function() {
            for (var npcId in _npcRoads)
                    moveNPC(npcId, _npcRoads[npcId]);
        },
        drawPathRoad: function(roadId, color) {
            drawPathLines(this.get(roadId), color);
        },
        detach: function(npcId) {
            if (Core.Helper.isset(_npcRoads[npcId]))
                delete _npcRoads[npcId];
        }
    };

    Core.include('Roads', Roads);

})();