const uuid = require('uuid/v4')
const express = require('express')
const bodyParser = require('body-parser')
const { createMemDocStore } = require('jsonotron-memdocstore')
const { Jsonotron } = require('./src/jsonotron')
const { createJsonotronExpress } = require('./src/jsonotron-express')

const roleTypes = [{
  name: 'admin',
  docPermissions: true
}]

const docTypes = [{
  name: 'flight',
  pluralName: 'flights',
  title: 'Flight',
  pluralTitle: 'Flights',
  fields: {
    airline: { type: 'shortString', description: 'The company operating the flight' },
    flightNo: { type: 'shortString', description: 'The flight number' },
    passengerCount: { type: 'positiveIntegerOrZero', description: 'The number of passengers on the flight.' }
  },
  policy: {
    canFetchWholeCollection: true
  }
}]

const docs = [
  { id: '001', docType: 'flight', airline: 'AirFrance', flightNo: 'FR001', passengerCount: 120 },
  { id: '002', docType: 'flight', airline: 'Delta', flightNo: 'DL541', passengerCount: 89 },
  { id: '003', docType: 'flight', airline: 'Norwegian', flightNo: 'NW888', passengerCount: 154 }
]

const start = () => {
  // create a new express app
  const app = express()

  // convert body to json if it's a recognised content-type
  app.use(bodyParser.json({
    type: function (req) {
      return ['application/json', 'application/json+merge+patch']
        .includes((req.headers['content-type'] || '').toLocaleLowerCase())
    },
    limit: 1024 * 10 /* 10k */
  }))

  // handle authentication
  app.use((req, res, next) => {
    req.roleNames = ['admin']
    next()
  })

  // create a new jsonotron using an in-memory docs database and the static config
  const memDocStore = new createMemDocStore(docs, d => uuid())
  const jsonotron = new Jsonotron(memDocStore, docTypes, roleTypes)

  // create an express delegate to convert HTTP requests to/from Jsonotron requests
  //   hosted at /jsondb/docs /schemas and /swagger
  const jsonotronExpress = createJsonotronExpress(jsonotron, {
    createDocStoreOptions: req => ({ tenantUrlName: req.params.tenantUrlName })
  })

  // hook up the routes to the desired paths
  const docsPath = '/docdb/docs/:tenantUrlName/:docTypePluralName'
  app.get(docsPath, jsonotronExpress.createGetCollectionHandler())
  app.post(docsPath, jsonotronExpress.createPostToCollectionHandler())
  app.get(docsPath + '/:id', jsonotronExpress.createGetDocumentHandler())
  app.delete(docsPath + '/:id', jsonotronExpress.createDeleteDocumentHandler())
  app.put(docsPath + '/:id', jsonotronExpress.createPutDocumentHandler())
  app.patch(docsPath + '/:id', jsonotronExpress.createPatchDocumentHandler())
  app.post(docsPath + '/:id/:operationName', jsonotronExpress.createPostOperationHandler())

  const port = 48001
  app.listen(port, () => console.log(`App listening on port ${port}!`))
}

start()
