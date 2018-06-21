# DevTools z-index

→ [日本語の紹介記事](https://ginpen.com/2018/06/20/devtools-z-index/)

**Stop `z-index: 999999` !!**

This adds "z-index" sub-pane of Elements panel for Chrome, "z-index" panel for Firefox.

[![Download from Chrome Web Store](doc/ChromeWebStore_Badge_v2_206x58.png)](https://chrome.google.com/webstore/detail/bcnpmhefiohkpmjacfoanhbjhikegmoe/publish-accepted)
[![Download Firefox add-ons](doc/AMO-button_1.png)](https://addons.mozilla.org/en-US/firefox/addon/devtools-z-index/)

## What for?

You may be shocked by finding how large numbers are used in your page. Unconsidered large numbers would be killed by another larger numbers, and those larger numbers also killed by much-larger numbers like war. That sucks.

This extension offers a table that helps reduce those numbers. You can keep your CSS code clean, maintainable and peaceful.

**No more `z-index: 2147483647` !!**

## Chrome extension

https://chrome.google.com/webstore/detail/bcnpmhefiohkpmjacfoanhbjhikegmoe/publish-accepted

![z-index pane in Elements panel, where you can find all elements with z-index](doc/screenshot.png)

![Click a selector to inspect the element in Elements panel](doc/video-400x269.gif)

## Firefox add-on

https://addons.mozilla.org/en-US/firefox/addon/devtools-z-index/

![z-index panel where you can find all elements with z-index](doc/screenshot-firefox-500.png)

Since Firefox doesn't allow us to add nice Inspector (Elements) panel's pane, I added it as a panel.

## Future feature

Honestly, I'm not planning to update since I felt satisfied tough, it would be fun to add following features.

- Fix: it finds a wrong element when some elements have the same selector (because it searches only by selector)
- Show useful information like stacking context
- Show something if an element's z-index is specified by style attribute
- Ability to update z-index for preview, like DevTools Style sub-pane
- Set better icon somehow

## License

- MIT

## Contact

- Ginpei Takanashi
- Twitter [@ginpei_en](http://twitter.com/ginpei_en)
- GitHub [@ginpei](https://github.com/ginpei/) / [devtools-z-index](https://github.com/ginpei/devtools-z-index)
- [Ginpei.info](https://ginpei.info/)
