/**
 * PostCSS automatic mathjs plugin
 *
 * @see https://github.com/less/less.js/blob/3.x/lib/less/render.js
 * @see https://github.com/shauns/postcss-math
 *
 * @package: postcss-automath
 * @author:  pospi <sam@everledger.io>
 * @since:   2016-10-17
 */

var postcss = require('postcss');
var helpers = require('postcss-message-helpers');
var less = require('less');

var lessParse = less.parse;
var ParseTree = less.ParseTree;

function transformMath(argString) {
    return new Promise(function(resolve, reject) {
        lessParse('.c{p:' + argString + '}', {}, function(err, root, imports, options) {
            if (err) { return reject(err); }

            try {
                var parseTree = new ParseTree(root, imports);
                var result = parseTree.toCSS(options);

                resolve(result.css.replace(/^\s*\.c\s*\{\s*p:\s*/gm, '').replace(/;\s*\}\s*$/gm, ''));
            } catch (err) {
                reject(err);
            }
        });
    });
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
             || node[nodeProp].match(/^\s*calc\s*\(/)   // exclude in-browser calc() statements
             || node[nodeProp].match(/^\d+\w*%$/)) {    // exclude special case for single percentage values
                return;
            }

            return transformMath(node[nodeProp])
                .then(function(computed) {
                    node[nodeProp] = computed;
                })
                .catch(function(e) {
                    // Silently discard Mathjs errors and leave the output alone.
                    // Important for ignoring generated classnames containing dashes.
                });
        })
    };
});
