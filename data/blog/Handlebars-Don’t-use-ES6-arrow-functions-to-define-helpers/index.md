---
title: 'Handlebars: Don’t use ES6 arrow functions to define helpers'
summary: Using ES6 arrow functions with Handlebar helpers will crash
tags:
  - Javascript
  - Handlebars
  - this
date: 2016-09-29 18:23:15
---

If you use the IMHO great [Handlebars](http://handlebarsjs.com) templating library in a real world project you need to write custom Handlebars Helpers. This are functions which return a string and which encapsulate your logic to prevent you and your team to implement business logic in templates.

The method `Handlebars.registerHelper` has a signature which looks like your bread and butter use case for [ES6 arrow functions](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/Arrow_functions):

```javascript
Handlebars.registerHelper( 'important', (...args) => args.join(this.exclamationMark) )`
```

But an arrow function doesn&#8217;t bind this [it just inherits it from its defining scope](https://derickbailey.com/2015/09/28/do-es6-arrow-functions-really-solve-this-in-javascript/).

```javascript
const global = this;

Handlebars.registerHelper('isThisGlobalInArrowFunction', () => this === global);

Handlebars.registerHelper('isThisGlobalInOldschoolFunction', function() {
  return this === global;
});
```

The first helper returns always `true`

The second helper will only return `true` if the executing context of it is also `global`

This is important because [Handlebars helpers use `this` as the context of the template execution](http://handlebarsjs.com/#helpers).

So basically just don&#8217;t use arrow function to define Handlebars helpers and if you have difficulties to understand Javascripts `this` have look at Dmitri Pavlutin [Gentle explanation of &#8216;this&#8217; keyword in JavaScript](https://rainsoft.io/gentle-explanation-of-this-in-javascript/).
