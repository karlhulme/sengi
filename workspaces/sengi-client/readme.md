# Sengi Client
 
> This package is part of the [Sengi](https://github.com/karlhulme/sengi) family.

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-client.svg)](https://www.npmjs.com/package/sengi-client)

A client library for reading and writing documents managed by a Sengi-based service.

## Installation

```bash
npm install sengi-client
```

## Usage

The `SengiClient` provides a simple Promised-based interface for accessing a Sengi-based service.  It automatically retries transitory errors.

To instantiate a `SengiClient` you have to provide the following parameters:

* **fetch** - A fetch function.  If undefined, the node-fetch library is used by default.  (This property is used during testing and it's unlikely you need to specify this.)

* **roleNames** - An array of the role names held by the user that is making the request.

* **retryIntervals** - An array of integers that specify the time to wait before trying again.  If undefined, the default retry strategy is [100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000].

* **url** - The url of the Sengi service.

```javascript
const client = new SengiClient({
  roleNames: ['admin'],
  url: 'https://localhost:1234'
})
```

## Methods

This section describes the methods available on the sengi client.

Document Methods | Description
---|---
createDocument | Create a new document using a DocType constructor.
deleteByDocumentId | Delete a document using it's id.
getDocumentById | Retrieve a single document using the documents id.
operateOnDocument | Invoke a DocType operation on a document.
patchDocument | Apply a merge patch to a document.
queryAllDocuments | Retrieve all the documents in a collection, specifying the fields to include in the result.
queryDocumentsByFilter | Retrieve the documents in a collection that match a DocType filter, specifying the fields to include in the result.
queryDocumentsByIds | Retrieve the documents in a collection with the given ids, specifying the fields to include in the result.
upsertDocument | Insert a new document (without calling the DocType constructor) or replace an existing document in the collection.

All of the above methods allow you to supply the following parameters:

* **pathComponents** - An array of path components that will be added to the url used to initialise the Sengi-Client.
* **roleNames** - An array of data service role names.  If supplied these are the only role names that will be sent with the request.  If omitted, the role names supplied with the Sengi-Client was constructed will be used.

Enum Methods | Description
---|---
getEnumTypeItems |  Retrieve the items that are defined within an enum identified by it's fully qualified name.

## Development

Written in Typescript.

Tests are written using Jest with 100% coverage.

```bash
npm test
```

The errors are tested using a mock Sengi service and the supertest framework.

The happy route is tested by spinning up a live Sengi service (using sengi-express) and hitting the end-points over the wire.

## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the family of libraries to be re-published.
