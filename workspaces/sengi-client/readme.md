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

Method Name | Description
---|---
getDocumentById | Retrieve a single document using the documents id.
saveNewDocument | Creates a new document using a DocType constructor.
operateOnDocument | Invoke a DocType operation on a Doc.

## Development

Tests are written using Jest with 100% coverage.

```bash
npm test
```

The errors are tested using a mock Sengi service and the supertest framework.

The happy route is tested by spinning up a live Sengi service (using sengi-express) and hitting the end-points over the wire.

## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the family of libraries to be re-published.
