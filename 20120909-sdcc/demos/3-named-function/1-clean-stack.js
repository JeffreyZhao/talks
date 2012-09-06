var MyClass = function () { }
MyClass.prototype = {

    foo: function () {
        this.bar();
    },

    bar: function () {
        this.baz();
    },

    baz: function () {
        throw new Error("Something got wrong!");
    }
};

var myClass = new MyClass();
myClass.foo();
