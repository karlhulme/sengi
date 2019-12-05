const convertErrorsToHttpStatusCodes = require('./convertErrorsToHttpStatusCodes')

const createDocumentDeleteHandler = (jsonotron, config) => {
  const handler = async (req, res) => {
    await jsonotron.deleteById({
      roleNames: req.roleNames,
      docTypeName: jsonotron.resolveDocTypeNameFromPlural({ docTypePluralName: req.params.docTypePluralName }),
      id: req.params.id,
      docStoreOptions: typeof config.createDocStoreOptions === 'function'
        ? config.createDocStoreOptions(req)
        : null
    })

    res.status(204).end()
  }

  return convertErrorsToHttpStatusCodes(handler)
}

module.exports = createDocumentDeleteHandler
