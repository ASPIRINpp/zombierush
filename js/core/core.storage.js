(function() {
    var _storage = {};

    Storage = {
        put: function(key, value) {
            _storage[key] = value;
        },
        get: function(key, defaultValue) {
            defaultValue = (typeof defaultValue === 'undefined') ? null : defaultValue;
            return (typeof _storage[key] === 'undefined') ? defaultValue : _storage[key];
        }
    };

    Core.include('Storage', Storage);
})();