'use strict';


var recast = require('recast');
var through = require('through');
var types = recast.types;
var namedTypes = types.namedTypes;
var builders = types.builders;


function compile(source) {
  var ast = recast.parse(source);

  return recast.print(transform(ast));
}

var DEV_EXPRESSION = builders.binaryExpression(
  '!==',
  builders.literal('production'),
  builders.memberExpression(
    builders.memberExpression(
      builders.identifier('process'),
      builders.identifier('env'),
      false
    ),
    builders.identifier('NODE_ENV'),
    false
  )
);

function transform(ast) {

  return types.traverse(ast, function(node, traverse) {

    if (namedTypes.Identifier.check(node)) {
      // If the identifier is the property of a member expression
      // (e.g. object.property), then it definitely is not a constant
      // expression that we want to replace.
      if (namedTypes.MemberExpression.check(this.parent.node) &&
          this.name === 'property' &&
          !this.parent.node.computed) {
        return false;
      }

      // There could in principle be a constant called "hasOwnProperty",
      // so be careful always to use Object.prototype.hasOwnProperty.
      if (node.name === '__DEV__') {
        // replace __DEV__ with process.env.NODE_ENV !== 'production'
        this.replace(DEV_EXPRESSION);
        return false;
      }

    } 
    else if (namedTypes.CallExpression.check(node)) {
      if (namedTypes.Identifier.check(node.callee) &&
          node.callee.name === 'invariant') {
        // Truncate the arguments of invariant(condition, ...)
        // statements to just the condition based on NODE_ENV
        // (dead code removal will remove the extra bytes).
        this.replace(
          builders.conditionalExpression(
            DEV_EXPRESSION,
            node,
            builders.callExpression(
              node.callee,
              [node.arguments[0]]
            )
          )
        );
        return false;
      }
    }
  });
}


module.exports = function () {
  var data = '';

  function write(buf) {
    data += buf;
  }

  function end() {
    this.queue(compile(data).code);
    this.queue(null);
  }

  return through(write, end);
};


module.exports.compile = compile;
module.exports.transform = transform;