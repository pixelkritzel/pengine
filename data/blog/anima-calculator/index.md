---
title: Anima Calculator - a little RPG tool written in React, Mobx-State-Tree and Typescript using Material UI
tags:
  - Javascript
  - React
  - Mobx
  - Typescript
date: 2018-08-15T19:43:56+02:00
---

![Screenshot of the Anima Calculator](screenshot.png 'Screenshot of the Anima Calculator')

In the last few days I build a tool for the game master of our Anima RPG round. The anima system tends to be a little bit overcomplicated. So when I told him I was looking for a side project and if he wished for some tool he told me something to track the initiative of characters would be great.

In most RPG systems the initiative determines the order in which characters can act in hectic moments like fights. One of the challenges for my friend is, the initiative changes for every round of the fight and he has to calculate possible advantages for characters after every change.

## The task

So I wanted to build a tool where you can enter all characters and you have second view for the fight itself in which you can add the characters. All characters should be persisted so you can close the app and don't loose any data.

There are differences between the characters played by the human players and the NSCs. RPG players usually want to roll their dices themself. So at the beginning of every round the game master asks every player for their roll. After this the fight starts with the character who has the highest initiative.

## The technologies

### React

There is not much need for an introduction. [React](https://reactjs.org/tutorial/tutorial.html) is a library developed by Facebook which allows you to compose the user interface of your app from components. It takes care of updating the browser after changes to the described UI and it uses a HTML like Javascript dialect called JSX instead of a templating language which translates to recurring calls to `React.createElement`. It uses an internal representation of the DOM called virtual DOM which enables it to minimize changes to the actual DOM. It does this by comparing two versions of its own virtual DOM and only applying the parts that differ. Never loose focus of a input again. Except when you set `autofocus` somewhere else.

### Mobx-State-Tree

State management is a one of my favourite topics. After the rise of React there were a lot of discussions how to handle data changes. In React every component can handle its own state and rerenders when the state changes. But to synchronise data between components you had to put it to a common ancestor and pass the data and functions to change the data down to every consuming component. This involved a lot of coupled code and if somebody introduced a new layer in the components tree this new component needed to pass all the data and functions too.

The Facebook team then suggested an architecture called Flux for this problem. [Dan Abramov](https://twitter.com/dan_abramov) surprised a lot of developer in his talk [Hot Reloading with Time Travel](https://www.youtube.com/watch?v=xsSnOQynTHs) by porting the [Elm Architecture](https://guide.elm-lang.org/architecture/) to Javascript as [Redux](https://redux.js.org/). It uses a single data store which is updated by pure functions which produce a new data state object. Redux comes with a few challenges. You have to write a lot boilerplate code and make sure not to mutate anything in a pretty mutable language. It can be done but it requires a skilled team and thorough code reviews. Accidental mutations can cause bugs which are really hard to find.

A completely different approach takes [MobX](https://mobx.js.org/) by [Michel Weststrate](https://twitter.com/mweststrate). It tracks state changes by mutation. Basically everything are properties of objects and MobX replaces the properties with [Javascripts getters and setters](https://javascriptplayground.com/es5-getters-setters/) or newer by using a [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object. Every function that consumes the data must need be decorated with MobX's `autorun` function. Now it can track which function consumes which properties in the getter call and can register changes to it in the setter call and execute all the tracking functions.

The most basic example would be:

```javascript
import { autorun, observable } from 'mobx';

const state = observable({
  name: ''
});

autorun(() => console.log(state.name));

state.name = 'Anima'; // logs Anima
state.name = 'Osterhase'; // logs Osterhase
```

MobX is really simple and this can be a problem because you can mutate stuff everywhere. There is no architecture or even suggested structure. And this is where [Mobx-State-Tree](https://github.com/mobxjs/mobx-state-tree) comes into play. It's by the same author and uses MobX with a strict structure. You have to define typed models which can only be mutated inside of methods which are registered to this model. It also provides functionality like emitting patches for mutations which is great if you want to incrementally save the data instead of costly serialising it every time (even if I don't use this feature in this small tool)

### Typescript

[Typescript](https://www.typescriptlang.org/) is basically Javascript with type annotations. A compiler runs over your code and annoys you until it can resolve every type. Which sounds awful at first for many developers which  mainly used dynamic languages like Javascript. But actually it is pretty great. After you satisfied the compiler you can be sure not to see something like the horrendous "Undefined is not a function" exception. Refactoring becomes kind of fun and you can even pause in the middle of it and go to lunch without fearing to start everything from scratch. And you get real autocompletion!

### Material UI

[Material UI](https://material-ui.com/) is a React implementation of Googles [Material Design](https://material.io/design/). It comes with basically everything you need for a standard UI.

## Experiences while developing

### React

The more I use the more I like the simplicity of React even if I don't agree with JSX. Often enough I wish for something like [Handlebars](https://handlebarsjs.com/) but for the most part it just works.

### Mobx-State-Tree

This is my second project with MST and the first one finished. Personally I like the structure it provides. My most common problem is when something doesn't respond to a state change I still fear I have to debug this huge library and every time the problem was I forgot to decorate the component with the MobX React [`observer`](https://mobx.js.org/refguide/observer-component.html).

#### Mobx-State-Tree and Typescript

This is interesting MobX and also Mobx-State-Tree are written in Typescript. And mostly it works great. I get warnings, Enums and everything after I figured some stuff out.

First of all how to get the type of my model?

```typescript
const myModel = types.model(...);

type IMyModelType = typeof myModel.Type;
```

If you need to access a method or property inside the same block you can't use `self` because it isn't typed yet. The problem looks like this.

```typescript
const myModel = types
	.model(...)
	.views(self => ({
		get fullName() {
			return `${self.firstName} ${self.lastName}`;
		},
		get fullNameWithAge() ({
			return `${self.fullName}, ${self.age}`; // type error because it can't find fullName on self
		})
	}));
```

There are two possibilities:

First: Start a new block

```typescript
const myModel = types
	.model(...)
	.views(self => ({
		get fullName() {
			return `${self.firstName} ${self.lastName}`;
		}
	}))
	.views(self => ({
		get fullNameWithAge() ({
			return `${self.fullName}, ${self.age}`; // now it works
		})
	});
```

Second: Use `this`

```typescript
const myModel = types
	.model(...)
	.views(self => ({
		get fullName() {
			return `${self.firstName} ${self.lastName}`;
		},
		get fullNameWithAge() ({
			return `${this.fullName}, ${self.age}`; // this also works
		})
	}));
```

And then there is something really weird. If you use the `Provider` and `inject of the [`mobx-react`](https://github.com/mobxjs/mobx-react) package [you have to make the injected store prop optional and after this you have to suffer the recommended strict null checking of Typescript](https://github.com/mobxjs/mobx-react#strongly-typing-inject).

### Typescript

Sometimes I still struggle with it and hope for better error messages. And still I don't want to miss it. The confidence to know if compiler doesn't complain I probably don't have a typo of doom in the code base is so much better. And there is still much to learn for me. My biggest struggle with Typescript itself (and not MST) was a package without typings. By my understanding it should have been imported with the type any but I ended up setting the `// @ts-ignore` flag which tells the compiler to give the next line a pass.

### Material UI

To start with the positive it looks great and I liked it better than the Bootstrap React implementations I used so far. But ...

The documentation is extensive and was at the same time not so helpful for me as I hoped. I still don't have any idea why the responsiveness of the table is so bad. And for styling it uses CSS-in-JS. I wasn't able to find good tooling for VS Code and also just to customise some parts in a side project I wasn't willing to learn the whole concept of themes and so on.

In future I would use Material UI only again if it would be in a big project and the whole team agrees on it. Because it looks simple at first but in the end this where I had the most question I needed to look up.

## Into the wild

So if you read so far you might be curios to have a look at the [app](https://anima-ini.pixelkritzel.de/) and the [source code](https://github.com/pixelkritzel/anima-calculator).

If you have any question you can write an Email to [timo@pixelkritzel.de](mailto:timo@pixelkritzel.de) or find me on [Twitter](https://twitter.com/pixelkritzel).
