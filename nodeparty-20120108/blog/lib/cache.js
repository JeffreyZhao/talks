var cache = {};

exports.get = function (key, callback) {
    return setTimeout(function () {
        var json = cache[key];
        callback(json ? JSON.parse(json) : null);
    }, 5);
};

exports.set = function (key, value, callback) {
    return setTimeout(function () {
        cache[key] = JSON.stringify(value);
        callback();
    }, 5);
};