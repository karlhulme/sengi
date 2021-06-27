import { CosmosClient } from  '@azure/cosmos'

const TEST_COSMOS_URL = process.env.SENGI_COSMOS_URL
const TEST_COSMOS_KEY = process.env.SENGI_COSMOS_KEY

/**
 * Adds the database and containers to the Cosmos DB instance as required for the test.
 * This script assumes that a serverless Cosmos DB instance is being used, and therefore
 * throughput requirements are not specified.
 */
async function setup () {
  const cosmosClient = new CosmosClient({
    endpoint: TEST_COSMOS_URL,
    key: TEST_COSMOS_KEY
  })

  console.log('Creating "sengi" database...')
  const databaseResult = await cosmosClient.databases.createIfNotExists({ id: 'sengi' })

  console.log('Creating "trees" container ...')
  await databaseResult.database.containers.createIfNotExists({ id: 'trees', partitionKey: '/id' })
  console.log('Creating "treePacks" container ...')
  await databaseResult.database.containers.createIfNotExists({ id: 'treePacks', partitionKey: '/environment' })

  console.log('Done.')
}

/**
 * Deletes the sengi database from the Cosmos DB instance.
 */
async function teardown () {
  const cosmosClient = new CosmosClient({
    endpoint: TEST_COSMOS_URL,
    key: TEST_COSMOS_KEY
  })

  try {
    await cosmosClient.database('sengi').delete()
  } catch (err) {
    if (err.code === 404) {
      console.log('Database not found.')
    } else {
      throw err
    }
  }
}

/**
 * Determine if we're setting up or tearing down based on command line args.
 */
if (process.argv.length >= 3) {
  const instruction = process.argv[2]

  switch (instruction) {
    case 'setup': { setup(); break }
    case 'teardown': { teardown(); break }
    default: console.log(`Unrecognised instruction: ${instruction}`)
  }
} else {
  console.log('Not enough command line parameters.')
}
