# Sengi

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi.svg)](https://www.npmjs.com/package/sengi)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

The core Sengi engine.

It interprets the field type definitions, doc type definitions and role definitions.

It validates and actions input requests, by issuing instructions to query the underlying datastore.

It mutates documents according to the defined mutators and patch policy, performs validation checks, and upserts modified documents back to the datastore.

It is powered by (Jsonotron)[https://github.com/karlhulme/jsonotron]

> This package is part of the Sengi system.
>
> Sengi is...
> * a small set of components for building a **NodeJS microservice**
> * for storing, patching and querying **JSON documents**
> * stored in a schemaless/NoSQL **database**
> * that have known, enforceable, and **evolving schemas**.
>
> **Visit https://karlhulme.github.io/sengi/ for details on how to get started.**

## Installation

```bash
npm install sengi
```

## Usage

> This package is used by Sengi service implementations, such as sengi-express.  Unless you are creating a new public interface for Jsonotron then you probably don't want to use this package directly!

```javascript
const { createSengi } = require('sengi')

const docStore = { fetch: () => {}, queryAll: () => {}}

const sengi = createSengi({ docStore, docTypes: [], roleTypes: [] })
```

## Constructor

Instantiate a Sengi engine with a configuration object:

* **docStore** - An object that implements the Sengi document store interface.

* **docTypes** - An array of Sengi document types.

* **roleTypes** - An array of Sengi role types.

* **enumTypes** - An array of Sengi field types that will be appended to the core enum types provided by Jsonotron.

* **schemaTypes** - An array of Sengi field types that will be appended to the core schema types provided Jsonotron.

* **formatValidators** - An array of format validators that will be appended to the built-in format validators.

* **dateTimeFunc** - A function that returns a UTC date/time string in docDateTime format.

* **onPreSaveDoc** - A function that is invoked just before a document is saved.  The function is passed roleNames, reqProps, docType and doc properties. If the document is being updated (rather than created or replaced) then a mergePatch property will be also be passed to the function that describes the changes. Any change made to the doc property or the mergePatch properties will be reflected in the document that is sent to the document store to be persisted.

* **onQueryDocs** - A function that is invoked when a query is executed, passed an object with roleNames, reqProps, docType, fieldNames and retrievalFieldNames properties.

* **onCreateDoc** - A function that is invoked when a document is created, passed an object with roleNames, reqProps, docType and doc properties.

* **onUpdateDoc** - A function that is invoked when a document is updated, passed an object with roleNames, reqProps, docType and doc properties.

* **onDeleteDoc** - A function that is invoked when a document is deleted, passed an object with roleNames, reqProps, docType and id properties.
