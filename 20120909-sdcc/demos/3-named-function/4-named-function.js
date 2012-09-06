try {
    var foo = function () {
        baz();
    }

    var bar = function _throw_() {
        throw new Error("Something got wrong!");
    };

    var baz = bar;

    bar = function () { 
        console.log('spoofed');
    };

    foo();
} catch (ex) {
    console.log(ex.stack);
}

console.log("=====================");

try {
    var foo = function () {
        bar();
    }

    var bar = (function () {
        return function _myFunction_() {
            throw new Error("Something got wrong!");
        };
    })();

    foo();
} catch (ex) {
    console.log(ex.stack);
}