(function () {
    var init = function (root) {
        
        if (!root.modules || !root.modules["async"]) {
            throw new Error('Missing essential component, please initialize "async" module first.');
        }
        
        if (root.modules["async-agent"]) {
            return;
        }
        
        var Task = root.Async.Task;
        
        var Agent = function () {
            this._messages = [];
            this._tasks = [];
            this._closed = false;
        }
        Agent.prototype = {
            receive: function () {
                var _this = this;

                return Task.create(function (t) {
                    if (_this._closed) {
                        t.complete("failure", { isClosed: true });
                    }
                    
                    if (_this._messages.length > 0) {
                        var msg = _this._messages.shift();
                        t.complete("success", msg);
                    } else {
                        _this._tasks.push(t);
                    }
                });
            },
            
            close: function () {
                this._closed = true;
                var tasks = this._tasks;
                
                delete this._tasks;
                delete this._messages;
                
                for (var i = 0; i < tasks.length; i++) {
                    tasks[i].complete("failure", { isClosed: true });
                }
            },

            post: function (msg) {
                if (this._closed) {
                    throw new Error("The agent is closed.");
                }
            
                if (this._tasks.length > 0) {
                    var t = this._tasks.shift();
                    t.complete("success", msg);
                } else {
                    this._messages.push(msg);
                }
            },
            
            currentQueueLength: function () {
                if (this._closed) {
                    return 0;
                }
                
                return this._messages.length;
            }
        };
        
        root.Async.Agent = Agent;
        
        root.modules["async-agent"] = true;
    }
    
    // CommonJS
    var isCommonJS = (typeof require === "function" && typeof module !== "undefined" && module.exports);
    // CommongJS Wrapping
    var isWrapping = (typeof define === "function" && !define.amd);
    // CommonJS AMD
    var isAmd = (typeof require === "function" && typeof define === "function" && define.amd);

    if (isCommonJS) {
        module.exports.init = init;
    } else if (isWrapping) {
        define("jscex-async-agent", ["jscex-async"], function (require, exports, module) {
            module.exports.init = init;
        });
    } else if (isAmd) {
        define("jscex-async-agent", ["jscex-async"], function () {
            return { init: init };
        });
    } else {
        if (typeof Jscex === "undefined") {
            throw new Error('Missing the root object, please load "jscex" module first.');
        }
    
        init(Jscex);
    }
})();
