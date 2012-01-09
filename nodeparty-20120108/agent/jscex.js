var Jscex = require("jscex");
require("jscex-jit").init(Jscex);
require("jscex-async").init(Jscex);
require("../lib/jscex-async-powerpack").init(Jscex);
require("../lib/jscex-async-agent").init(Jscex);

Jscex.logger.level = Jscex.Logging.Level.INFO;

module.exports = Jscex;
