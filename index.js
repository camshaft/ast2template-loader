/**
 * Module dependencies
 */

var ast2template = require('ast2template');
var path = require('path');

module.exports = function(source) {
  this.cacheable && this.cacheable();

  var res = this.resourcePath;
  var filename = path.basename(res, path.extname(res));

  if (filename === 'index' || filename === 'error') filename = path.basename(path.dirname(res)) + '/' + filename;

  var opts = this.options.ast2template || {};

  opts.passThroughProps = ~(this.query || '').indexOf('pass-through');
  opts.name = 'render_' + filename
    .replace(/-/g, '_')
    .replace(/[\/\.]/g, '__');

  var out = ast2template(source, opts);

  return out;
};
