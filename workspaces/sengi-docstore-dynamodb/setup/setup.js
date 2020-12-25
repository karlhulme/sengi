// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require('aws-sdk')

const TEST_DYNAMODB_URL = 'http://localhost:8000'
const TEST_DYNAMODB_REGION = 'us-east-1'
const TABLE_NAME = 'sengi.testing.trees'

/**
 * Returns true if the table exists, otherwise false.
 * @param {Object} dynamoClient A dynamo client.
 * @param {String} tableName The name of a table.
 */
async function doesTableExist (dynamoClient, tableName) {
  try {
    await dynamoClient.describeTable({ TableName: tableName }).promise()
    return true
  } catch (err) {
    if (err.code === 'ResourceNotFoundException') {
      return false
    } else {
      throw err
    }
  }
}

/**
 * Prepares the local database for running the tests.
 */
async function setup () {
  AWS.config.update({
    region: TEST_DYNAMODB_REGION,
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx'
  })

  const dynamoClient = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    endpoint: TEST_DYNAMODB_URL,
    region: TEST_DYNAMODB_REGION
  })

  if (await doesTableExist(dynamoClient, TABLE_NAME)) {
    console.log('Delete table')
    await dynamoClient.deleteTable({ TableName: TABLE_NAME }).promise()
  }

  console.log('Create table')
  await dynamoClient.createTable({
    TableName: TABLE_NAME,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'docType', AttributeType: 'S' },
      { AttributeName: 'heightInCms', AttributeType: 'N' }
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    GlobalSecondaryIndexes: [{
      IndexName: 'treeHeightIndex',
      KeySchema: [{ AttributeName: 'docType', KeyType: 'HASH' }, { AttributeName: 'heightInCms', KeyType: 'RANGE' }],
      Projection: {
        NonKeyAttributes: ['name'],
        ProjectionType: 'INCLUDE'
      },
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }]
  }).promise()
}

setup()
