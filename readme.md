# Jsonotron

![](https://github.com/karlhulme/jsonotron/workflows/CI/badge.svg)
[![npm](https://img.shields.io/npm/v/jsonotron.svg)](https://www.npmjs.com/package/jsonotron)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

The core Jsonotron engine.

It interprets the field type definitions, doc type definitions and role definitions.

It validates and actions input requests, by issuing instructions to query the underlying datastore.

It mutates documents according to the defined mutators and patch policy, performs validation checks, and upserts modified documents back to the datastore.

> This package is part of the [Jsonotron](https://www.jsonotron.io) system.
>
> Jsonotron is...
> * a small set of components for building a **NodeJS microservice**
> * for storing, patching and querying **JSON documents**
> * stored in a schemaless/NoSQL **database**
> * that have known, enforceable, and **evolving schemas**.
>
> **Visit https://www.jsonotron.io for details on how to get started.**
>
> **Although for the moment, check out the documentation.md file to see what's been written so far!!**

## Installation

```bash
npm install jsonotron --save
```

## Usage

> This package is used by Jsonotron service implementations, such as Jsonotron-express.  Unless you are creating a new public interface for Jsonotron then you probably don't want to use this package directly!

To instantiate a Jsonotron engine you have to provide 3 or 4 parameters:

* **docStore** - An object that implements the Jsonotron document store interface.

* **docTypes** - An array of Jsonotron document types.

* **roleTypes** - An array of Jsonotron role types.

* **config** - An optional configuration object with the following properties:
  * **config.customFieldTypes** - An array of Jsonotron field types.

```javascript
const { createJsonotron } = require('jsonotron')

const docStore = { fetch: () => {}, queryAll: () => {}}
const docTypes = []
const roleTypes = []

const jsonotron = createJsonotron(docStore, docTypes, roleTypes)
```
