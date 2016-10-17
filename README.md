# PostCSS Auto-Math

## Work-in-progress!

[PostCSS] plugin for evaluating math expressions in your CSS sources.


This plug-in supports:

* Plain-old maths, as per math.js built-in functionality
* `px` units
* CSS-friendly rendering (`10cm` not `10 cm`)
* Unit stripping e.g. `strip(25px)` becomes `25`

Contributions are very welcome!


```scss
.foo {
    font-size: 2 * 8px;	
    padding: strip(16cm) + (2px * 3);
    margin: 4px + 2 * 3px;
}
```

```css
.foo {
    font-size: 16px;
    padding: 22px;
    margin: 10px;
}
```

## Usage

```js
postcss([ require('postcss-math') ])
```

See [PostCSS] docs for examples for your environment.

## How does this differ to `postcss-calc`?

They're (deliberately) trying to work towards the calc(...) standard, so for 
instance it doesn't support things like exponentials at the moment. This wraps 
up math.js so you have a wider range of things you can do.

## How does this differ to `postcss-math` & `postcss-mathjs`?

Those plugins want you to add non-standard function wrappers (the `resolve()` 
function) around each expression you want evaluated. This module allows you
to write normal math expressions you'd be used to from using SASS, SCSS or LESS.
