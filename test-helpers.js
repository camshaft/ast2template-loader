exports.DOM = function DOM(name, props) {
  return {
    name: name,
    props: props,
    children: [].slice.call(arguments, 2).reduce(function(acc, child) {
      if (!child) return acc;
      if (!Array.isArray(child)) child = [child];
      acc.push.apply(acc, child);
      return acc;
    }, [])
  };
};

exports.$get, function $get(path, parent, fallback) {
  for (var i = 0, child; i < path.length; i++) {
    if (!parent) return undefined;
    child = parent[path[i]];
    if (typeof child === 'function') parent = child.bind(parent);
    else parent = child;
  }
  return parent;
};
