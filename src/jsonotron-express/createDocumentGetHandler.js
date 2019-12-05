const convertErrorsToHttpStatusCodes = require('./convertErrorsToHttpStatusCodes')
const csvStringToArray = require('./csvStringToArray')

const createDocumentGetHandler = (jsonotron, config) => {
  const handler = async (req, res) => {
    // check req has
    //  .roleNames atleast one string to define what the requesting user can do
    //  .params.docTypePluralName or params.docTypeName so it can be looked up
    //  .params.id to indicate which document to return
    //  .query.fields to indicate which parts of the document to return
    const result = await jsonotron.queryDocumentsByIds({
      roleNames: req.roleNames,
      docTypeName: jsonotron.resolveDocTypeNameFromPlural({ docTypePluralName: req.params.docTypePluralName }),
      fieldNames: csvStringToArray(req.query.fields),
      ids: [req.params.id],
      docStoreOptions: typeof config.createDocStoreOptions === 'function'
        ? config.createDocStoreOptions(req)
        : null
    })

    if (result.docs.length === 0) {
      res.status(404).end()
    } else {
      res.status(200).json(result.docs[0])
    }
  }

  return convertErrorsToHttpStatusCodes(handler)
}

module.exports = createDocumentGetHandler
