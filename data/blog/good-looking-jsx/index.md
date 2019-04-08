---
title: Good looking JSX
summary: An attempt for different kind of placements of JSX
tags:
  - Javascript
  - React
date: 2015-09-26 16:09:32
---

A few weeks ago I decided to let Ember.js go. After using it on an on-off base for a year I was just tired of it. And so I&#8217;m looking into React.js &#8211; the shiny newcomer.

I like the principle that React does one thing &#8211; managing the view layer of an application. And the one thing I don&#8217;t like is this dangling snippet of &#8220;HTML&#8221; at the end of an object:

```jsx
import React, { Component } from 'react';

export class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: 'foo',
      bar: 'bar'
    };
  }

  handleFormSubmit(event) {
    event.preventDefault();
    /* ... */
  }

  render() {
    return (
      <form onSubmit={this.handleFormSubmit.bind(this)}>
        <input type="text" value={this.foo} ref="foo" />
        <button type="submit">Go!</button>
      </form>
    );
  }
}
```

It looks odd, I don&#8217;t want send a web designer down a JS object to change a class or something. And for me it&#8217;s still different &#8211; it doesn&#8217;t contain any real logic. But the render method might do to compute properties. And it kind of messes up my indentation.

But mostly this just represents a very complicated function call &#8230;

So I could to this:

```jsx
import React, { Component } from 'react';

var template = function template() { return(
<form onSubmit={ this.handleFormSubmit.bind(this) } >
  <input type="text" value={ this.foo } ref="foo" />
  <button type="submit">Go!</button>
</form>
)}

export class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    foo: "foo",
    bar: "bar"
    }
  }

  handleFormSubmit(event) {
    event.preventDefault();
    /* ... */
  }

  render() {
    return(
	  return template.call(this);
    )
  }
}
```

Much better. But now it is just variable. I could do this:

```jsx
import React, { Component } from 'react';
import template from './MyComponentsTemplate';

export class MyComponent extends Component {
  /* skipping all this */

  render() {
    retun template.call(this)
  }
}
```

And creating the file MyComponentsTemplate.js:

```jsx
import React from 'react';

var template = function() {
  return (
    <form onSubmit={this.handleFormSubmit.bind(this)}>
      <input type="text" value={this.foo} ref="foo" />
      <button type="submit">Go!</button>
    </form>
  );
};

export default template;
```

Now I have a separate file where people can see or edit the &#8220;HTML&#8221;. And I feel better knowing that the logic is separated from the presentation.
