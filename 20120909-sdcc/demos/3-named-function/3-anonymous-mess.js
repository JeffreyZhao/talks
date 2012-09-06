var foo = function () {
    bar();
}

var bar = (function () {
    return function () {
        throw new Error("Something got wrong!");
    };
})();

foo();