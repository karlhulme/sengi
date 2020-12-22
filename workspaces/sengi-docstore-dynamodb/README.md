# Sengi-DynamoDB

![](https://github.com/karlhulme/sengi-docstore-dynamodb/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/sengi-docstore-dynamodb.svg)](https://www.npmjs.com/package/sengi-docstore-dynamodb)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A wrapper for AWS DynamoDB that implements the Sengi document store interface.


## Installation

```bash
npm install sengi-docstore-dynamodb
```


## Usage

For authentication, you should either set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` keys or login using the `aws configure` command with the AWS Command Line tool.  For testing/CI/CD against the emulator the env vars can be dummy values.

To instantiate a DynamoDbDocStore you have to provide the following parameters:

* **dynamoUrl** - A url that identifies your DynamoDB instance.  To use the production DynamoDB on AWS specify http://dynamo/production.

* **region** - The region of DynamoDB to send requests to.

* **getTableName** - A function `(docTypeName: string, docTypePluralName: string, options: DocStoreOptions)` that returns the name of the table to edit.  This is a good opportunity to add a prefix that describes the project and environment, e.g. rather than 'shows', we could use 'sengi.testing.shows'.

* **generateDocVersionFunc** - A function that returns a unique string to use for versioning a document.

```javascript
const dynamoDbDocStore = new DynamoDbDocStore({
  dynamoUrl: DYNAMO_URL,
  region: REGION,
  generateDocVersionFunc: () => 'xxxx', // use crypto.randomBytes 
  getTableNameFunc: (docTypeName: string, docTypePluralName: string, options: DocStoreOptions) => TABLE_NAME
})
```


## Filters

A filter expression is based on a secondary index.

```javascript
const filterExpression = {
  indexName: 'mySecondaryIndex',
  condition: 'docType = :docType and heightInCms > :heightInCms', // must supply both of these parts
  conditionParams: {
    ':docType': 'tree',
    ':heightInCms': 100
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

DynamoDB can create secondary indexes but these are not quite analogous to secondary indexes on Mongo, Cosmos or RDBMS systems.  In DynamoDB a secondary index is essentially a copy of the original table with (a) a subset of the columns, and (b) a different singular sort key.  This presents a few limitations for Sengi:

* You can only order on a single sort key.  A secondary sort will need to be done in memory by the client.
* You must filter based on the hash key before the sort key is applied.  If there is no sensible hash key to use, perhaps because you want to filter across the whole dataset, then you can use the `docType` field as a hash value.  In this scenario you'll only have 1 partition so it's important not to project too many fields into it.


## Limitations

DynamoDB does not support the concept of an arbitrary numerical offset, so the `offset` parameter in queries will be ignored.

If you request a field that has not been projected into a secondary index, Sengi will not know.  You will simply not receive that field.


## Database

To setup a local copy of DynamoDB for testing you'll need to install the docker image and setup the initial tables.

```bash
# install db
docker run -d -p 8000:8000 amazon/dynamodb-local:1.13.4

# add tables
npm run setup
```

The tests will find this database as long as its running on port 8000.


## Development

Tests are written using Jest with 100% coverage.

```javascripts
npm test
```

Note that the tests run sequentially (`jest --runInBand`) so that only one test can access the database at a time. 


## Continuous Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the library to be re-published.
