/**
 * Module dependencies
 */

var ast2template = require('ast2template');
var loaderUtils = require('loader-utils');
var path = require('path');

module.exports = function(source) {
  this.cacheable && this.cacheable();

  var res = this.resourcePath;
  var filename = path.basename(res, path.extname(res));

  if (filename === 'index' || filename === 'error') filename = path.basename(path.dirname(res)) + '/' + filename;

  var opts = loaderUtils.parseQuery(this.query);

  opts.nativePath = !!opts['native-path'];
  opts.passThroughProps = !!opts['pass-through'];
  opts.name = 'render_' + filename
    .replace(/-/g, '_')
    .replace(/[\/\.]/g, '__');

  var self = this;
  // this is pretty hacky... but it works!
  var count = 0;
  opts.resolveFilter = function(type, content, attrs) {
    var fs = self._compiler.inputFileSystem;
    var read = fs._readFileStorage.data;
    var stats = fs._statStorage.data;
    var name = res + '__filter' + (count++) + '.' + type;
    read[name] = [null, new Buffer(content)];
    stats[name] = stats[res];
    return name;
  };

  var out = ast2template(source, opts);

  return out;
};
