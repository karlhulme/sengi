# Jsonotron

![](https://github.com/karlhulme/jsonotron/workflows/CI/badge.svg)
[![npm](https://img.shields.io/npm/v/jsonotron.svg)](https://www.npmjs.com/package/jsonotron)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

The core Jsonotron engine.

It interprets the field type definitions, doc type definitions and role definitions.

It validates and actions input requests, by issuing instructions to query the underlying datastore.

It mutates documents according to the defined mutators and patch policy, performs validation checks, and upserts modified documents back to the datastore.

> This package is part of the Jsonotron system.
>
> Jsonotron is...
> * a small set of components for building a **NodeJS microservice**
> * for storing, patching and querying **JSON documents**
> * stored in a schemaless/NoSQL **database**
> * that have known, enforceable, and **evolving schemas**.
>
> **Visit https://karlhulme.github.io/jsonotron/ for details on how to get started.**

## Installation

```bash
npm install jsonotron --save
```

## Usage

> This package is used by Jsonotron service implementations, such as Jsonotron-express.  Unless you are creating a new public interface for Jsonotron then you probably don't want to use this package directly!

Instantiate a Jsonotron engine with a configuration object:

* **docStore** - An object that implements the Jsonotron document store interface.

* **docTypes** - An array of Jsonotron document types.

* **roleTypes** - An array of Jsonotron role types.

* **fieldTypes** - An array of Jsonotron field types that will be appended to the built-in field types.

* **onFieldsQueried** - A function that is invoked whenever a query is executed.  The function will be passed an array of the fields queried.  This may be useful for determining when deprecated fields are no longer being used.

```javascript
const { createJsonotron } = require('jsonotron')

const docStore = { fetch: () => {}, queryAll: () => {}}

const jsonotron = createJsonotron({ docStore, docTypes: [], roleTypes: [] })
```
