---
title: Changing Font(-Size) in XCode with less pain
summary: Changing the font size in the Xcode editor by editing the theme file
tags:
  - Tools
  - XCode
date: 2015-01-25 16:28:15
---

One of the first things you might recognize when you start using XCode is the tiny font in the code editor. If you&#8217;re used to a bigger or complete different font, you head over to the _Preferences_ and see a dialog where you habe to change the font by hand for every instance of text. It is worse than Eclipse.

But the good news is you have to this only for one instance.

So choose your base theme and change the first text type by clicking on the little &#8220;T&#8221; button thingy.

![Xcode Preferences](xcode-preferences.png 'Xcode Preferences')

Now you can open the modified theme at: `~/Library/Developer/Xcode/UserData/FontAndColorThemes/[Theme-Name].dvtcolortheme` in a text editor.

There you will find a lot of font declarations in form of `&lt;string&gt;Menlo-Bold - 11.0&lt;/string&gt;`. But one value will be the value of your chosen font and it&#8217;s size.

All you have to do now is replacing the original `&lt;string&gt;` elements with you new element and restart Xcode.
