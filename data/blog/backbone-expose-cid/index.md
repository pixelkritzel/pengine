---
title: 'Note to myself: Backbone – expose model cid to attributes object'
summary: Sometimes you need to expose Backbones generated cid property to the template. I spend way to much time to figure this one out.
tags:
  - Javascript
  - Backbone.js
date: 2015-03-13 13:24:01
---

Sometimes you need the `cid` of your backbone model in your view. Backbone doesn&#8217;t provide it in its attributes property. But you can&#8217;t add the ID there manually in the initialize method:

```javascript
App.Model = Backbone.Model.extend({
  initialize: function() {
    this.set('cid', this.cid);
  }
});
```
