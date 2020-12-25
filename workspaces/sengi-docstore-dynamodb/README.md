# Sengi DocStore DynamoDB
 
> This package is part of the [Sengi](https://github.com/karlhulme/sengi) family.

![](https://github.com/karlhulme/sengi/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-docstore-dynamodb.svg)](https://www.npmjs.com/package/sengi-docstore-dynamodb)

A wrapper for Amazon's AWS Dynamo DB that implements the Sengi document store interface.

## Installation

```bash
npm install sengi-docstore-dynamodb
```

## Usage

The `DynamoDbDocStore` implements the DocStore interface defined in sengi-interfaces.

To instantiate a `DynamoDbDocStore` you have to provide the following parameters:

* **dynamoUrl** - A url that identifies your Dynamo DB instance.  This should be the phrase `'production'` or the url to a local instance.

* **region** - The AWS region where the Dynamo DB resides.  If using a local instance this value is not used.

* **generateDocVersionFunc** - A function `() => string` that returns a string of random characters.

* **getTableNameFunc** - A function `(docTypeName: string, docTypePluralName: string, options: DocStoreOptions) => string` that returns the name of the table.

```javascript
const dynamoDbDocStore = new DynamoDbDocStore({
    dynamoUrl: 'production',
    region: 'us-east-1',
    generateDocVersionFunc: () => crypto.randomBytes(Math.ceil(10)).toString('hex').slice(0, 20),
    getTableNameFunc: (docTableName, docTypePluralName) => `mySystem.myEnv.${docTypePluralName}`
  })
```

This example uses the standard NodeJs `crypto` library to produce a string of 20 random hex characters for `generateDocVersionFunc`.


## Filters

Filter expressions are expected to be a `DynamoDbFilterExpression` object.  This interface is exported from the library.

This is an example filter expression returned from a DocType filter implementation:

```javascript
const filterExpression = {
  indexName: 'mySecondaryIndex',
  condition: 'docType = :docType and heightInCms > :heightParam', // must supply both of these parts
  conditionParams: {
    ':docType': 'tree',
    ':heightParam': 200
  }
}
```

## Indexes

This provider requires the key schema of each table to be based on the string field named `id`.

```json
{
  "TableName": "myTable",
  "KeySchema": [{ "AttributeName": "id", "KeyType": "HASH" }]
}
```

DynamoDB can create secondary indexes but these are not quite analogous to secondary indexes on Mongo, Cosmos or RDBMS systems.  In DynamoDB a secondary index is essentially a copy of the original table with (a) a subset of the columns, and (b) a different partition and sort key.  This presents a few limitations for Sengi:

* You can only order on a single sort key.  A secondary sort will need to be done in memory by the client.
* You must filter based on the hash key before the sort key is applied.  If there is no sensible hash key to use, perhaps because you want to filter across the whole dataset, then you can use the `docType` field as a hash value.  In this scenario you'll only have 1 partition so it's important not to project too many fields into it.


## Limitations

DynamoDB does not support the concept of an arbitrary numerical offset when fetching documents, so the `offset` parameter in queries will be ignored.

If you request a field that has not been projected into a secondary index, Sengi will not know.  You will simply not receive that field.


## Setup

To run the tests you will need a locally running instance of the Dynamo database with the test tables.  The following commands setup a local copy on docker and creates the necessary tables:

```bash
docker run -d -p 8000:8000 amazon/dynamodb-local:1.13.4
npm run setup
```

To instantiate a connection with a production DynamoDB instance you will need to install the `aws cli` tool.  You then call `aws configure` to establish credentials (`AWS Access Key ID`, `AWS Secret Access Key`, and `Default Region Name`) that can invoke operations on DynamoDB.


## Development

Tests are written using Jest with 100% coverage.

```bash
npm test
```

Note that the tests run sequentially (`jest --runInBand`) so that only one test can access the database at a time. 


## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the family of libraries to be re-published.
