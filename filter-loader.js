/**
 * Module dependencies
 */

var utils = require('loader-utils');
var fs = require('fs');
var values = [];

exports = module.exports = function(source, path) {
  var opts = utils.parseQuery(this.query);

  var inputValues = this.inputValues;
  if (!inputValues) inputValues = values || [];

  var out = inputValues[opts.key];

  if (!out) throw new Error('Missing inputValues[' + opts.key + ']');

  return out;
};

var count = 0;
exports.loadFilter = function(content, extension, query) {
  var i = count++;
  values[i] = content;
  return require.resolve('./filter-loader') + '?key=' + i + '!' + getDummyFile(extension || 'js') + (query ? '?'+query : '');
}

var dummyFiles = {};
function getDummyFile(extension) {
  var name = __dirname + '/null.' + extension;
  if (!dummyFiles[name]) {
    fs.writeFileSync(name, '// noop');
    dummyFiles[name] = true;
  }
  return name;
}
