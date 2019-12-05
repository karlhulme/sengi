const convertErrorsToHttpStatusCodes = require('./convertErrorsToHttpStatusCodes')

const createDocumentPutHandler = (jsonotron, config) => {
  const handler = async (req, res) => {
    if (!req.body.opId) {
      throw new Error('The body must contain an opId property that uniquely identifies this update.')
    }

    const opId = req.body.opId
    delete req.body.opId

    await jsonotron.operateOnDocument({
      roleNames: req.roleNames,
      docTypeName: jsonotron.resolveDocTypeNameFromPlural({ docTypePluralName: req.params.docTypePluralName }),
      id: req.params.id,
      opId,
      operationName: req.params.operationName,
      operationParams: req.body,
      docStoreOptions: typeof config.createDocStoreOptions === 'function'
        ? config.createDocStoreOptions(req)
        : null
    })

    res.setHeader('Location', `/docdb/docs/${req.params.tenantUrlName}/${req.params.docTypePluralName}/${req.params.id}`)
    res.status(303).end()
  }

  return convertErrorsToHttpStatusCodes(handler)
}

module.exports = createDocumentPutHandler
