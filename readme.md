# Sengi

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-engine.svg)](https://www.npmjs.com/package/sengi-engine)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

DOCUMENTATION IS A MESS SINCE MOVING TO A MONO-REPO - NEEDS RE-WRITING

Components:

* Sengi Engine for processing requests
* Sengi Express provides an HTTP/RESTful layer
* Sengi Interfaces defines the shared types
* Document store wrapper for Cosmos DB (Microsoft Azure)
* Document store wrapper for Dynamo DB (Amazon AWS)
* Document store wrapper for Mongo DB (Mongo)
* In-memory document store

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

* **onPreQueryDocs** - A function that is invoked when a query is about to be executed.

* **onSaveDoc** - A function that is invoked when a document has been saved to the database.

* **onPreSaveDoc** - A function that is invoked when a document has been updated and is about to be saved to the database.

* **onDeleteDoc** - A function that is invoked when a document has been deleted.

## Database Guidance

Document databases claim to be infinitely scalable but in practice documents will be divided up into physical sets.  Where possible, we want to query a single physical set as this will yield better performance than querying multiple physical sets.

To deal with this, we divide documents into 2 types:

* An **authoritative document** that contains the largely normalised data for an entity - it is always accessed by it's id.
* A **warehouse document** that is indexed on multiple fields - it is used with filters.

The **authoritative documents** are stored in a collection that uses the id as the partition key.  This ensures a good spread of documents across any logical or physical partitions created by the database while allowing us to access them with only one piece of information.

Authoritative records must contain the ids of any documents that they link to.  This means a parent record will contain an array of child record ids.  It may be necessary to store some of the display fields on the child records in the parent too.

The **warehouse documents** are stored in a collection that use a domain-specific partition key.  This key should divide the data up into chunks, typically a few GB.  Geographic values like salesRegion or salesOffice often work well.  We're trying to avoid hot partitions and achieve an even spread of data.  Most challenging of all, the partition key needs to be something that is passed with every (or at least most) queries.

If you have a dataset for which no partition key makes sense, then you can store all the records in the same physical partition.  For example use a partition key of docType, which will be the same for every record.  You will need to monitor this dataset to ensure it doesn't exceed the limits of the database storage for a single partition.  Be conservative about the quantity of fields stored for each warehouse record to maximise the number of records that can be stored in this way.

To keep all the documents in sync you'll a mechanism that can write to multiple records in sequence in a fault-tolerant manner.  Crucially, if a second or third record needs to be updated but fails, you'll need a system that presents this as a problem to be fixed with the opportunity to resume/try-again.  [Piggle](https://github.com/karlhulme/piggle) is an appropriate light framework for this.

## Guidance on Filters

Filters should generally hit a specific index.  This means they should specify the fields and sort order defined on a secondary index on the collection.  Filter parameters could be used to control the ordering but only options covered by indexes should be offered.  This may not be necessary if the number of documents in a collection is small.

## Guidance on Extracting Whole Collections

If you need to extract all the documents from a non-trivial collection then it will be necessary to do it sections.

To extract an entire collection, a client should use a filter to extract subsets of the data in multiple queries.  For example, query all the records named A-M, then query all the records N-Z.  The right strategy and the number of queries will depend on the size of the collection.  This approach is resilient to changes in the source collection.  You won't get duplicates and you won't be missing documents that were in the collection at the start of the extraction.  You may be missing documnts that were added during the extraction (or holding documents removed during the extraction) but of course that can be resolved the next time the synchronisation takes place.

Skip and Limit are included as a convenience, but should not be used for enumerating through "pages" of a collection.  This is not reliable because the collection can change between requests.  Imagine you ask for the first 10 records.  Then an additional 3 records get inserted into the database at the front.  Records previously at index 8, 9 and 10 are now at index 11, 12, 13.  So if you request records 11-20 you'll get duplicates.  Databases do not guarantee the order of documents, so omitting a search order will not help.  It also isn't performant because implementations at the database level will often involve walking the entire result set so skip/limit will take longer and longer to run as the numbers get larger.  For this reason, some databases (e.g. AWS DynamoDO) don't provide any support for Offset. 

## Development

Code base adheres to the rules chosen by https://standardjs.com/.  Code is formatted with 2 spaces.

Tests are written using Jest with 100% coverage.

```javascript
npm test
```

## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the library to be re-published.
