---
title: DOM events on input type=date and type=time
summary: There differences how Android and iOS handle the change and blur events for input type=date and type=time
tags:
  - DOM
date: 2014-02-20 23:43:56
---

Do you know these days where you want to stop doing frontend coding and do something simple instead like driver programming in Assembler? Today is such a day. And like every other day in the past it is a different implementation of the DOM.

For many user interactions you need the user to provide a date or time. And there where a lot of more less good working datepicker. But with rise of mobile it became obvious that a little popup box &#8211; with at least 35 little links in it &#8211; could be done better.

![Boostrap date picker](bootstrap-datepicker.png 'Boostrap date picker')

And there it was: the promise of HTML5 inputs for date and time. And finally they shipped first in Chrome, then iOS and now in Android 4.4 (Kitkat). And they looked good and reasonable.

![Android date picker](chrome-android-datepicker.png 'Android date picker')

![iOS date picker](iOS-datepicker.png 'iOS date picker')

But it seems somebody forgot to specify when the events will fire. On mobile devices you have a slideup or a modal dialog. And part of this dialog is a little &#8216;done&#8217; button.

Guess when the `change` event and when the `blur` event will be fired?

Regardless what you guessed, you&#8217;re wrong.

Chrome on Android behaves like the datepicker is a closed component:

* If you change the date and THEN press the &#8216;done&#8217; button `change` will fire.
* But the input still has focus and so `focusout` and `blur` will fire after you touched something else

Safari on iOS does the opposite:

* As soon as you change one of the THREE wheels a `change` event will fire.
* As soon as you press the &#8216;done&#8217; button the input looses focus and `blur` and `focusout` fire

I prepared [a little demo site](test_site.html) where the events will become green after they fired.

Ironically with selects on iOS that uses also this wheel interface `change` fires after pressing the &#8216;done&#8217; button.

So for now I have no other idea than sniffing the user agent. Welcome back to 2002!
