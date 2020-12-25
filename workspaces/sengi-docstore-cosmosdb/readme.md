# Sengi DocStore CosmosDB
 
> This package is part of the [Sengi](https://github.com/karlhulme/sengi) family.

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-docstore-cosmosdb.svg)](https://www.npmjs.com/package/sengi-docstore-cosmosdb)

A wrapper for Microsoft's Azure Cosmos DB that implements the Sengi document store interface.

## Installation

```bash
npm install sengi-docstore-cosmosdb
```

## Usage

The `CosmosDbDocStore` implements the DocStore interface defined in sengi-interfaces.

To instantiate a `CosmosDbDocStore` you have to provide the following parameters:

* **cosmosUrl** - A url that identifies your Cosmos DB instance.

* **cosmosKey** - A master key with read and write access to your Cosmos DB instance.

* **getDatabaseNameFunc** - A function `(docTypeName: string, docTypePluralName: string, options: DocStoreOptions) => string` that returns the name of the database to connect to.

* **getContainerNameFunc** - A function `(databaseName: string, docTypeName: string, docTypePluralName: string, options: DocStoreOptions) => string` that returns the name of the container to edit.

* **getPartitionKeyFunc** - A function `(databaseName: string, containerName: string, docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions) => string|null` that returns the value of a document's partition key.  Typically this will return the id or something from the options
object that has been populated by the Sengi interface.  For example, the Sengi-Express library will place the additional path components (for example the tenant ID) into the options for use here.  If the partition key is not known, just return null and the library will look it up.

```javascript
const cosmosDbDocStore = new CosmosDbDocStore({
  cosmosUrl: TEST_COSMOS_URL,
  cosmosKey: TEST_COSMOS_KEY,
  getDatabaseNameFunc: (docTypeName: string, docTypePluralName: string, options: DocStoreOptions) => 'sengi',
  getContainerNameFunc: (databaseName: string, docTypeName: string, docTypePluralName: string) => docTypePluralName,
  getPartitionKeyFunc: (databaseName: string, containerName: string, docTypeName: string, docTypePluralName: string, id: string) => docTypePluralName === 'trees' ? id : null
})
```

## Filters

Filters are passed unchanged to the SQL execution engine.  For this reason, filters should always be specified server side.

Assume the table is qualified with the letter `d`.  For example, `d.myField = 'VALUE' and d.myOtherField > 25`.

## Setup

To run the tests you will need an Azure Account with a Cosmos instance running.  If a linux-compatible docker image for Cosmos emerges, this will no longer be necessary.

In the mean-time, you will need to configure the following environent variables:

* SENGI_COSMOS_URL: `https://<your-account-name>.documents.azure.com`
* SENGI_COSMOS_KEY: `abcdabcdabcdabcdabcdabcd==`

You will then need to run `npm run setup` in order to create database.  This needs to be left running (and available) so that CI/CD tests can run.

You can remove the database by running `npm run teardown`.

## Development

Test run requires the --detectOpenHandles flag because occassionally a handle is held open - no idea why.
This slows the opening test by a few seconds.
Unable to find any async functions that we're not awaiting on the result, and all network calls are connection-less.  Maybe a bug in cosmosclient?

Tests are written using Jest with 100% coverage.

```bash
npm test
```

Note that the tests run sequentially (`jest --runInBand`) so that only one test can access the database at a time. 

## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the family of libraries to be re-published.
