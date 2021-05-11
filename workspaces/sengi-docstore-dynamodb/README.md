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
  condition: 'docType = :docType and heightInCms > :heightParam', // can use just the equality, or equality and sort
  conditionParams: {
    ':docType': 'tree',
    ':heightParam': 200
  }
}
```

DynamoDB defines a long list of [reserved words](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html).  If the field of a doc uses one of these names it is necessary to alias the field (# prefix) using a condition param name as shown below:

```javascript
const filterExpression = {
  indexName: 'mySecondaryIndex',
  condition: '#docTypeVar = :docType and heightInCms > :heightParam',
  conditionParams: {
    ':docType': 'tree',
    ':heightParam': 200
  },
  conditionParamNames: {
    '#docTypeVar': 'docType'
  }
}
```


## Indexes

This provider requires each table to be partitioned on a string field named `id`.  To do this, specify the key schema as follows:

```json
{
  "TableName": "myTable",
  "KeySchema": [{ "AttributeName": "id", "KeyType": "HASH" }]
}
```

DynamoDB can create secondary indexes but these are not quite analogous to secondary indexes on Mongo, Cosmos or RDBMS systems.  In DynamoDB a secondary index is essentially a copy of (or a subset of) the original table with a different partition (hash) and sort key.

For authoratitive child documents, you will need a mechanism for finding all the child records that are *owned* by a given parent.  You do this by filtering the child table based on the parent table id.  To enable this, create a global secondary index specifying the parent record's id as the hash code.  This will allow you to create a `DocType` filter on the child table that targets the parent id.

For warehousing documents, you can specify any field to act as a partition key.  If there is no sensible field to use, perhaps because you want to filter across the whole dataset, then you can use the `docType` field as the partition key.  In this scenario you'll only have 1 partition so it's important not to project too many fields into it.


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
