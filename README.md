# firebase-down

[![Travis](https://secure.travis-ci.org/digidem/firebase-down.svg)](http://travis-ci.org/digidem/firebase-down)
[![Coverage Status](https://coveralls.io/repos/github/digidem/firebase-down/badge.svg?branch=master)](https://coveralls.io/github/digidem/firebase-down?branch=master)
[![npm](https://img.shields.io/npm/v/firebase-down.svg)](https://www.npmjs.com/package/firebase-down)
[![npm](https://img.shields.io/npm/dm/firebase-down.svg)](https://www.npmjs.com/package/firebase-down)

> LevelDOWN adapter for Firebase realtime database

A drop-in replacement for [LevelDOWN](https://github.com/level/leveldown) that works with [Firebase realtime database](https://firebase.google.com/).

Can be used as a backend for [LevelUP](https://github.com/level/levelup) rather than an actual LevelDB store.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Install

```
npm install --save firebase-down
```

## Usage

```js
var levelup = require('levelup')
var FirebaseDOWN = require('firebase-down')
var firebase = require('firebase/app')
require('firebase/database')

var config = {
  apiKey: "apiKey",
  databaseURL: "https://databaseName.firebaseio.com"
}

var firebaseApp = firebase.initializeApp(config)
var firebaseDown = FirebaseDOWN(firebaseApp)

var db = levelup('level', {db: firebaseDown})
```

## API

### `var firebaseDown = FirebaseDOWN(firebaseApp)``

Returns a constructor function that can be passed to [`levelup`](https://github.com/level/levelup), implements the [`abstract-leveldown`](https://github.com/Level/abstract-leveldown) interface. `firebaseApp` should be an instance of [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App).

Call levelup with `var db = levelup(location, {db: firebaseDown})` where `location` should be a string path to a key in a firebase database, e.g. `/path/to/key`. The leveldown database will be stored under this key.

## Contribute

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © Gregor MacLennan
