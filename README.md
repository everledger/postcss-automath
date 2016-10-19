# PostCSS Auto-Math

[PostCSS]: https://github.com/postcss/postcss

[PostCSS] plugin for evaluating math expressions in your CSS sources.

This plug-in uses the [LESS](http://lesscss.org/) parser internally, in an 
(intentionally) very limited way- just to parse mathematical expressions. 
As such, all unit handling mechanics are the same as in LESS.

If you want full LESS parsing functionality in your project, see 
[postcss-less-engine](https://www.npmjs.com/package/postcss-less-engine).


```scss
.foo {
    font-size: 2 * 8px;	
    margin: 4px + 2 * 3px;
}
```

```css
.foo {
    font-size: 16px;
    margin: 10px;
}
```

## Usage

```js
postcss([ require('postcss-automath') ])
```

For best results, add the plugin after any variable parsing, mixin processing or
function handling plugins. Since `postcss-automath` works on the final numeric
values of your CSS you need to process all variables, mixins and other dynamic
data *beforehand*.

See [PostCSS] docs for examples for your environment.

## How does this differ to `postcss-calc`?

They're (deliberately) trying to work towards the calc(...) standard, so for 
instance it doesn't support things like exponentials at the moment.

## How does this differ to `postcss-math` & `postcss-mathjs`?

Those plugins want you to add non-standard function wrappers (the `resolve()` 
function) around each expression you want evaluated. This module allows you
to write normal math expressions you'd be used to from using SASS, SCSS or LESS.

Since the variable handling is deferred to another plugin, you are free to use
this module with SCSS, LESS, W3C or even your own custom syntax.
