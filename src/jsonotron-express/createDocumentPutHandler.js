const convertErrorsToHttpStatusCodes = require('./convertErrorsToHttpStatusCodes')

const createDocumentPutHandler = (jsonotron, config) => {
  const handler = async (req, res) => {
    if (req.body.id !== req.params.id) {
      throw new Error(`Document id '${req.body.id}' does not match id in the url '${req.params.id}'.`)
    }

    await jsonotron.replaceDocument({
      roleNames: req.roleNames,
      docTypeName: jsonotron.resolveDocTypeNameFromPlural({ docTypePluralName: req.params.docTypePluralName }),
      doc: req.body,
      docStoreOptions: typeof config.createDocStoreOptions === 'function'
        ? config.createDocStoreOptions(req)
        : null
    })

    // how to resolve the new location?
    res.setHeader('Location', `/docdb/docs/${req.params.tenantUrlName}/${req.params.docTypePluralName}/${req.params.id}`)
    res.status(200).end()
  }

  return convertErrorsToHttpStatusCodes(handler)
}

module.exports = createDocumentPutHandler
