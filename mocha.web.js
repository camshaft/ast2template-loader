require("!!script-loader!mocha/mocha.js");

var Mocha = window.mocha.constructor;
var BaseReporter = Mocha.reporters.Base;

function Reporter(runner) {
  BaseReporter.call(this, runner);
  var symbols = BaseReporter.symbols;

  var reports = [];

  runner.on('suite', function(suite) {
    if (suite.title) console.group('%c#' + suite.title + ' (' + suite.file + ')', 'color: gray;');
  });

  runner.on('suite end', function(suite) {
    if (suite.title) console.groupEnd();
  });

  runner.on('test', function(test) {
    if (test.title) console.groupCollapsed(test.title);
  });

  runner.on('pass', function(test) {
    if (test.title) console.groupEnd();
    console.log('%c' + symbols.ok + ' passed (%dms)', 'color: green; font-style: italic', test.duration);
  });

  runner.on('fail', function(test) {
    console.error(test.err.stack);
    if (test.title) console.groupEnd();
    console.log('%c' + symbols.err + ' failed (%dms)', 'color: red; font-style: italic', test.duration);
  });
}

module.exports = function(file) {
  var test = {
    __run: function() {
      return mocha.run();
    }
  };

  var mocha = new Mocha({
    ui: "bdd",
    reporter: Reporter
  });
  mocha.suite.file = file;
  mocha.suite.emit("pre-require", test, file, mocha);

  return test;
};
