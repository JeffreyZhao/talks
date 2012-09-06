var foo = function () {
    baz();
}

var bar = function () {
    throw new Error("Something got wrong!");
};

var baz = bar;

bar = function () { 
    console.log('spoofed');
}

foo();