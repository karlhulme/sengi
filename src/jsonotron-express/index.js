const createCollectionGetHandler = require('./createCollectionGetHandler')
const createCollectionPostHandler = require('./createCollectionPostHandler')
const createDocumentDeleteHandler = require('./createDocumentDeleteHandler')
const createDocumentGetHandler = require('./createDocumentGetHandler')
const createDocumentPatchHandler = require('./createDocumentPatchHandler')
const createDocumentPostHandler = require('./createDocumentPostHandler')
const createDocumentPutHandler = require('./createDocumentPutHandler')

const createJsonotronExpress = (jsonotron, config) => {
  return {
    createGetCollectionHandler: reqConfig => createCollectionGetHandler(jsonotron, Object.assign({}, config, reqConfig)),
    createPostToCollectionHandler: reqConfig => createCollectionPostHandler(jsonotron, Object.assign({}, config, reqConfig)),
    createDeleteDocumentHandler: reqConfig => createDocumentDeleteHandler(jsonotron, Object.assign({}, config, reqConfig)),
    createGetDocumentHandler: reqConfig => createDocumentGetHandler(jsonotron, Object.assign({}, config, reqConfig)),
    createPatchDocumentHandler: reqConfig => createDocumentPatchHandler(jsonotron, Object.assign({}, config, reqConfig)),
    createPostOperationHandler: reqConfig => createDocumentPostHandler(jsonotron, Object.assign({}, config, reqConfig)),
    createPutDocumentHandler: reqConfig => createDocumentPutHandler(jsonotron, Object.assign({}, config, reqConfig))
  }
}

module.exports = {
  createJsonotronExpress
}
