/**
 * PostCSS automatic mathjs plugin
 *
 * @see https://github.com/shauns/postcss-math
 *
 * @package: postcss-automath
 * @author:  pospi <sam@everledger.io>
 * @since:   2016-10-17
 */

var postcss = require('postcss');
var helpers = require('postcss-message-helpers');
var maths = require('mathjs');

var PREFIXES = maths.type.Unit.PREFIXES;
var BASE_UNITS = maths.type.Unit.BASE_UNITS;

BASE_UNITS.PIXELS = {
    dimensions: [0, 1, 0, 0, 0, 0, 0, 0, 0],
    key: 'PIXELS'
};

maths.type.Unit.UNITS.px = {
    name: 'px',
    base: BASE_UNITS.PIXELS,
    prefixes: PREFIXES.NONE,
    value: 1,
    offset: 0,
    dimensions: [0, 1, 0, 0, 0, 0, 0, 0, 0]
};

maths.type.Unit.prototype.strip = function() {
    return this._denormalize(this.value);
};

function strip(value) {
    return value.strip();
}
maths.import({
    strip: strip
});

function transformMath(argString) {
    var res = maths.eval(argString);
    // Add previous splitted unit if any
    var formatted = res.toString();

    // Math.JS puts a space between numbers and units, drop it.
    formatted = formatted.replace(/(.+) ([a-zA-Z]+)$/, '$1$2');
    return formatted;
}

module.exports = postcss.plugin('postcss-math', function () {
    return function (css) {

        // Transform CSS AST here
        css.walk(function (node) {
            var nodeProp;

            if (node.type === 'decl') {
                nodeProp = 'value';
            }
            else if (node.type === 'atrule' && node.name === 'media') {
                nodeProp = 'params';
            }
            else {
                return;
            }

            if (!node[nodeProp] // no value
             || !node[nodeProp].match(/\d/) // no numbers
             || !node[nodeProp].match(/\*|\+|\/|-|%/)   // no math
             || node[nodeProp].match(/^\d+\w*%$/)) {    // exclude special case for single percentage values
                return;
            }

            node[nodeProp] = helpers.try(function () {
                return transformMath(node[nodeProp]);
            }, node.source);
        })
    };
});
