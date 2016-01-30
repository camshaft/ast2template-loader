/**
 * Module dependencies
 */

var ast2template = require('ast2template');
var loadFilter = require('./filter-loader').loadFilter;
var loaderUtils = require('loader-utils');
var path = require('path');

exports = module.exports = function(source) {
  this.cacheable && this.cacheable();

  var req = this.request;
  var res = this.resourcePath;
  var filename = path.basename(res, path.extname(res));

  if (filename === 'index' || filename === 'error') filename = path.basename(path.dirname(res)) + '/' + filename;

  var opts = loaderUtils.parseQuery(this.query);

  opts.nativePath = !!opts['native-path'];
  opts.passThroughProps = !!opts['pass-through'];
  opts.name = 'render_' + filename
    .replace(/-/g, '_')
    .replace(/[\/\.]/g, '__');

  opts.resolveFilter = function(extension, content, attrs) {
    var loaders = attrs.loaders || attrs.loader;
    loaders = loaders ? (loaders) + '!' : '';
    var request = loaders + loadFilter(content, extension, attrs.query);
    return request;
  };

  var relative = path.relative(process.cwd(), res)

  opts.renderTest = function(tests) {
    var request = loadFilter([
      'var mocha = require(' + JSON.stringify(require.resolve(this.target == 'web' ? './mocha.web.js' : './mocha.node.js')) + ')(' + JSON.stringify(relative) + ');',
      'var should = require("should");',
      'var template = require(' + JSON.stringify('!!' + req) + ');',
      'var __helpers = require(' + JSON.stringify(opts.testHelpers || require.resolve('./test-helpers')) + ');',
      'var render = __helpers.renderer ? __helpers.renderer(template) : function(props, state, params, query, error) {',
      '  props = props || {};',
      '  state = state || {};',
      '  var self = Object.assign({props: props, state: state}, template);',
      '  return template.render.call(self, __helpers.DOM, __helpers.$get, props, state, __helpers.$yield, params, query, __helpers.forms, __helpers.t, error);',
      '}',
      'with(mocha) {',
      '  describe(' + JSON.stringify(opts.name) + ', function() {',
      '    ' + tests.split('\n').join('\n    '),
      '  });',
      '}',
      'mocha.__run();'
    ].join('\n') + '\n', 'js');

    return 'if (process.env.NODE_ENV != "production") require(' + JSON.stringify(request) + ');\n';
  }.bind(this);

  var out = ast2template(source, opts);

  return out;
};
