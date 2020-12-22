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
const { Sengi } = require('sengi')

const docStore = { fetch: () => {}, queryAll: () => {}}

const sengi = new Sengi({ docStore, docTypes: [], roleTypes: [] })
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

## Guidance on Filters

Filters should generally hit a specific index.  This means they should specify the fields and sort order defined on a secondary index on the collection.  Filter parameters could be used to control the ordering but only options covered by indexes should be offered.  This may not be necessary if the number of documents in a collection is small.

## Guidance on Extracting Whole Collections

If you need to extract all the documents from a non-trivial collection then it will be necessary to do it sections.

To extract an entire collection, a client should use a filter to extract subsets of the data in multiple queries.  For example, query all the records named A-M, then query all the records N-Z.  The right strategy and the number of queries will depend on the size of the collection.  This approach is resilient to changes in the source collection.  You won't get duplicates and you won't be missing documents that were in the collection at the start of the extraction.  You may be missing documnts that were added during the extraction but of course that can be resolved the next time the synchronisation/extraction takes place.

Skip and Limit are included as a convenience, but should not be used for enumerating through "pages" of a collection.  This is not reliable because the collection can change between requests.  Imagine you ask for the first 10 records.  Then an additional 3 records get inserted into the database at the front.  Records previously at index 8, 9 and 10 are now at index 11, 12, 13.  So if you request records 11-20 you'll get duplicates.  If you specify a sort order in the underlying query then this problem clearly exists.  If you don't specify any sort order then they can't assume anything about the order of requests from one request to the next.  If records get deleted there is similar issue with missing records.  It also isn't performant because implementations at the database level will often involve walking the entire result set so skip/limit will take longer and longer to run as the numbers get larger.

## Development

Code base adheres to the rules chosen by https://standardjs.com/.  Code is formatted with 2 spaces.

Tests are written using Jest with 100% coverage.

```javascript
npm test
```

## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the library to be re-published.
