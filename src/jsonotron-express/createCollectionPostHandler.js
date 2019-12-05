const convertErrorsToHttpStatusCodes = require('./convertErrorsToHttpStatusCodes')

const createCollectionPostHandler = (jsonotron, config) => {
  const handler = async (req, res) => {
    if (!req.body.id) {
      throw new Error('The body must contain an id property to be assigned to the new document.')
    }

    const id = req.body.id
    delete req.body.id

    await jsonotron.createDocument({
      roleNames: req.roleNames,
      docTypeName: jsonotron.resolveDocTypeNameFromPlural({ docTypePluralName: req.params.docTypePluralName }),
      id,
      constructorParams: req.body,
      docStoreOptions: typeof config.createDocStoreOptions === 'function'
        ? config.createDocStoreOptions(req)
        : null
    })

    // how to resolve the new location?
    res.setHeader('Location', `/docdb/docs/${req.params.tenantUrlName}/${req.params.docTypePluralName}/${id}`)
    res.status(201).end()
  }

  return convertErrorsToHttpStatusCodes(handler)
}

module.exports = createCollectionPostHandler
