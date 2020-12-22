# Sengi-MongoDB

![](https://github.com/karlhulme/sengi-mongodb/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-mongodb.svg)](https://www.npmjs.com/package/sengi-mongodb)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A wrapper for Mongo DB that implements the Sengi document store interface.

## Installation

```bash
npm install sengi-mongodb
```

## Usage

To instantiate a MongoDbDocStore you have to provide the following parameters:

* **mongoUrl** - A url that identifies your Mongo DB instance.

* **mongoOptions** - An object that describes how to connect to mongo.  This is passed directly to the `MongoClient` constructor.  See the example below for connecting with a username and password.

* **config** - A configuration object

  * **getDatabaseName** - A function (docTypeName, docTypePluralName, options) that returns the name of the database to connect to.

  * **getCollectionName** - A function getCollectionName (databaseName, docTypeName, docTypePluralName, options) that returns the name of the collection to edit.

```javascript
const { createMongoDbDocStore } = require('sengi-mongodb')

const mongoDbDocStore = createMongoDbDocStore(
  'mongodb://database.server...',
  {
    auth: { user: 'sengi', password: 'sengi' },
    useUnifiedTopology: true
  },
  {
    getDatabaseName: (docTypeName, docTypePluralName, options) => 'myDatabaseName',
    getCollectionName: (databaseName, docTypeName, docTypePluralName, options) => docTypePluralName
  }
)

mongoDbDocStore.connect()
.then(() => {
  mongoDbDocStore.upsert('test', 'tests', {
    id: '0001',
    docType: 'test',
    docOps: [],
    hello: 'world'
  })
})
```

## Setup

To run the tests locally you will need MongoDB running locally:
* Listening at `https://127.0.0.1:27017`
* With an admin/root user named `sengi` and with password `sengi`.
* The database `sengi` and collection `trees`, that are used by the automated tests, will be created automatically.

You can set mongo running on your local machine by running the following docker command:

```bash
docker run -d --name test-mongo-with-sengi -p 127.0.0.1:27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=sengi \
    -e MONGO_INITDB_ROOT_PASSWORD=sengi \
    mongo:4.2.9
```

You can use the usual docker comands to start and stop the instance.

```bash
docker ps -a
docker stop <first-4-characters>
docker rm <first-4-characters>
```

You can connect to the server by using the Mongo SH client (mongosh).

```bash
mongosh mongodb://127.0.0.1:27017 -u sengi -p sengi
```

You can issue the following commands, using Mongo SH client, to work with databases and collections.  This is not required.

```bash
show databases
use sengi
show collections
db.createCollection('trees')
db.trees.drop() # to remove it again.
```

## Development

Code base adheres to the rules chosen by https://standardjs.com/.  Code is formatted with 2 spaces.

Tests are written using Jest with 100% coverage.

```javascripts
npm test
```

Note that the tests run sequentially (`jest --runInBand`) so that only one test can access the database at a time. 

## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the library to be re-published.
