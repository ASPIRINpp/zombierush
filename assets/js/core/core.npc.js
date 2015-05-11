(function() {

    // Storage
    var _storage = new Array(), _keys = new Array();

    /**
     * Put NPC in storage
     * @param {string} key Name of NPC
     * @param {object} npc NPC
     * @returns {undefined}
     */
    function putNpc(key, npc) {
        if (_keys.indexOf(key) !== -1)
        {
            // Replace
            _storage[_keys[_keys.indexOf(key) + 1]] = npc;
        } else {
            // Add new
            var index = (_storage.push(npc) - 1);
            _keys.push(key);
            _keys.push(index);
        }
    }

    /**
     * Get NPC from storage
     * @param {string} key Name of NPC
     * @returns {object} NPC
     */
    function getNpc(key) {
        var index = _keys[_keys.indexOf(key) + 1];
        return _storage[index];
    }

    function getNpcIndex(key) {
        return _keys[_keys.indexOf(key) + 1];
    }

    function destroyNpc(key) {

        // Delete from storage
        _storage.splice(_keys[_keys.indexOf(key) + 1], 1);
        // Get index
        var index = _keys.indexOf(key) + 1;
        // Delete from keys
        _keys.splice(_keys.indexOf(key), 2);
        // Normalyze keys & npc sprites id
        for (var k = index; k < _keys.length; k += 2)
        {
            _keys[k]--;
            _storage[_keys[k]].spriteId--;
//            _storage[_keys[k]].sprite = Core.Sprite.get(_storage[_keys[k]].spriteId);
        }

    }

    function getDefaultOptions() {
        return {
            health: 100,
            speed: 14,
            pos: [0, 0],
            tile: null,
            resource: null,
            sprite: {
                resourceUrl: null,
                pos: [0, 0],
                levels: {bottom: 0, right: 1, left: 2, top: 3, die: 6},
                size: [64, 64],
                speed: 0,
                frames: [],
                dir: 'horizontal',
                once: null
            },
            animation: {},
            events: {}
        };
    }


    /**
     * Create NPC has never been so easy
     * @param {object} options Options NPC
     * @param {string} uid UID NPC, default random
     * @returns {string} UID new NPC
     */
    function createNpc(options, uid) {
        // Generate uid
        uid = CH.isset(uid) ? uid : CH.unquid('yy-xxxx');

        // Load default NPC params
        var NPC = getDefaultOptions();

        // Apply params
        for (var k in options)
        {
            //@todo This work only two level object
            if (typeof options[k] === 'object' && Core.Helper.isset(NPC[k])) {
                for (var x in options[k])
                    NPC[k][x] = options[k][x];
            } else
                NPC[k] = options[k];
        }

        // Create Sprite
        var spriteId = Core.Sprite.add(NPC.sprite.resourceUrl, NPC.sprite.pos, NPC.pos, NPC.sprite.levels, NPC.sprite.size, NPC.speed, NPC.sprite.frames, NPC.sprite.dir, NPC.sprite.once);
        NPC.sprite = Core.Sprite.get(spriteId);
        NPC.spriteId = spriteId;

        // Put NPC in storage
        putNpc(uid, NPC);

//        //@TODO 
//        var index = getNpcIndex(uid);
//        _storage[index].sprite.posOnMap = _storage[index].pos;

        return uid;
    }


    Npc = {
        go: function() {
            var CoreHelper = Core.Helper;
            for (var k = 0, count = _storage.length; k < count; k++)
                if (_storage[k].length > 0 // Hack for fix bug
                        && CoreHelper.isset(_storage[k].events) 
                        && CoreHelper.isset(_storage[k].events.update))
                    _storage[k].events.update();
        },
        add: function(params, uid) {
            return createNpc(params, uid);
        },
        get: function(uid) {
            return getNpc(uid);
        },
        getAll: function() {
            return _storage;
        },
        damage: function(uid, damage) {
//            console.log(uid + ': damage ' + damage);
            _storage[getNpcIndex(uid)].health = _storage[getNpcIndex(uid)].health - damage;
//            console.log(_storage[getNpcIndex(uid)].health);
        },
        destroy: function(uid) {
            // Get NPC
            var NPC = getNpc(uid);

            if (Core.Helper.isset(NPC) === false)
                return;

            // Send events
            if (Core.Helper.isset(NPC.events) && Core.Helper.isset(NPC.events.destroy))
                NPC.events.destroy();

            // Get is sprite
            var spriteId = NPC.spriteId;
            NPC = null;

            // Delete sprite in storage
            Core.Sprite.destroy(spriteId);

            // Delete NPC in storage
            destroyNpc(uid);

        }
    };

    Core.include('Npc', Npc, function() {
        // Load NPC Animation module
        Core.includeModule('npc.animation', true);
    });
})();