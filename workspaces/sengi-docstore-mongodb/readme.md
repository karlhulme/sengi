# Sengi DocStore MongoDB
 
> This package is part of the [Sengi](https://github.com/karlhulme/sengi) family.

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-docstore-mongodb.svg)](https://www.npmjs.com/package/sengi-docstore-mongodb)

A wrapper for Mongo DB that implements the Sengi document store interface.

## Installation

```bash
npm install sengi-docstore-mongodb
```

## Usage

The `MongoDbDocStore` implements the DocStore interface defined in sengi-interfaces.

To instantiate a `MongoDbDocStore` you have to provide the following parameters:

* **mongoUrl** - A url that identifies your MongoDB instance.  This should be prefixed with mongo://.

* **mongoOptions** - An object that describes how to connect to mongo.  This is passed directly to the `MongoClient` constructor.  See the example below for connecting with a username and password.

* **generateDocVersionFunc** - A function `() => string` that returns a string of random characters.

* **getDatabaseNameFunc** - A function `(docTypeName: string, docTypePluralName: string, options: DocStoreOptions) => string` that returns the name of a database.

* **getCollectionNameFunc** - A function `(databaseName: string, docTypeName: string, docTypePluralName: string, options: DocStoreOptions) => string` that returns the name of a collection.

```javascript
const mongoDbDocStore = new MongoDbDocStore({
    mongoUrl: 'mongodb://localhost:27017',
    mongoOptions: {
      auth: { user: 'sengi', password: 'sengi' },
      useUnifiedTopology: true
    },
    generateDocVersionFunc: () => crypto.randomBytes(Math.ceil(10)).toString('hex').slice(0, 20),
    getDatabaseNameFunc = (docTypeName, docTypePluralName, options) => 'myDatabase',
    getCollectionNameFunc: (databaseName, docTableName, docTypePluralName, options) => docTypePluralName
  })
```

This example uses the standard NodeJs `crypto` library to produce a string of 20 random hex characters for `generateDocVersionFunc`.


## Filters

Filter expressions are expected to be a `FilterQuery<Doc>` object.

The Mongo documentation explains how to specify filter objects in more detail.

This is an example filter expression returned from a DocType filter implementation:

```javascript
const filterExpression = {
  heightInCms: { $gt: 200 }
}
```

## Indexes

See the Mongo documentation for setting up secondary indexes on Mongo collections.

Ensure any DocType filters will hit a specific index to ensure performant responses.


## Limitations

The current MongoDB client library is connection-based rather than connection-less.

This can lead to some problems determining when to connect and how to handle interruptions to that connection.

Hopefully a connection-less version of the client library will be available in the future.


## Setup

To run the tests locally you will need MongoDB listening at `mongodb://127.0.0.1:27017` with an admin/root user named `sengi` and with password `sengi`.

The database `sengi` and collection `trees`, that are used by the automated tests, will be created automatically.

The following command sets up an appropriate local instance of Mongo via docker.

```bash
docker run -d --name test-mongo-with-sengi -p 127.0.0.1:27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=sengi \
  -e MONGO_INITDB_ROOT_PASSWORD=sengi \
  mongo:4.2.9
```

You can connect to the server by using the Mongo SH client (mongosh) as per the example below.  There is also a GUI tool you can download.

```bash
mongosh mongodb://127.0.0.1:27017 -u sengi -p sengi
```

You can issue the following commands, using Mongo SH client, to work with databases and collections.  This is not required.

```bash
show databases
use sengi
show collections
db.createCollection('trees')
db.trees.drop()
```


## Development

Tests are written using Jest with 100% coverage.

```bash
npm test
```

Note that the tests run sequentially (`jest --runInBand`) so that only one test can access the database at a time. 


## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the family of libraries to be re-published.
