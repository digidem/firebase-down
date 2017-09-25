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
var db = levelup(new FirebaseDOWN(firebaseApp, 'namespace'))
```

## API

### `var firebaseDown = new FirebaseDOWN(firebaseApp[, location])``

Creates a new FirebaseDOWN instance stored in `firebaseApp` at `location`. `firebaseApp` should be an instance of [`firebase.app.App`](https://firebase.google.com/docs/reference/js/firebase.app.App). `location` should be a string path to a key in a firebase database, e.g. `/path/to/key` or an instance of [`firebase.database.Reference`](https://firebase.google.com/docs/reference/js/firebase.database.Reference) e.g. `firebaseApp.database().ref('/path/to/key')`.

`firebaseDown` implements the [`abstract-leveldown`](https://github.com/Level/abstract-leveldown) interface and can be passed to a [`levelup`](https://github.com/level/levelup) constructor e.g. `var db = levelup(firebaseDown)`.

## Contribute

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © Gregor MacLennan
