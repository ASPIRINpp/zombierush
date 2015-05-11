/**
 * Loading splash
 * @returns {{show: Function, hide: Function}}
 */
function loader() {
    var _self = {
        _id: 'loading',
        _check: function() {
            return (document.getElementById(_self._id) !== null);
        },
        _show: function() {
            document.getElementById(_self._id).style.display = 'block';
        },
        _hide: function() {
            document.getElementById(_self._id).style.display = 'none';
        }
    };

    return {
        /**
         * Show splash
         */
        show: function() {
            _self._show();
        },
        /**
         * Hide splash
         */
        hide: function() {
            _self._hide();
        }
    };
}

/**
 * Render game menu
 * @returns {undefined}
 */
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