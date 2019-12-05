const convertErrorsToHttpStatusCodes = require('./convertErrorsToHttpStatusCodes')
const csvStringToArray = require('./csvStringToArray')

const createCollectionGetHandler = (jsonotron, config) => {
  const handler = async (req, res) => {
    const docTypeName = jsonotron.resolveDocTypeNameFromPlural({ docTypePluralName: req.params.docTypePluralName })
    const docStoreOptions = typeof config.createDocStoreOptions === 'function'
      ? config.createDocStoreOptions(req)
      : null

    if (req.query.ids && req.query.ids.length > 0) {
      const result = await jsonotron.queryDocumentsByIds({
        roleNames: req.roleNames,
        docTypeName,
        fieldNames: csvStringToArray(req.query.fields),
        ids: csvStringToArray(req.query.ids),
        docStoreOptions
      })

      res.status(200).json(result.docs)
    } else if (req.query.filterName && req.query.filterName.length > 0) {
      const result = await jsonotron.queryDocumentsByFilter({
        roleNames: req.roleNames,
        docTypeName,
        fieldNames: csvStringToArray(req.query.fields),
        filterName: req.query.filterName,
        filterParams: req.query.filterParams ? JSON.parse(req.query.filterParams) : null,
        docStoreOptions
      })

      res.status(200).json(result.docs)
    } else {
      const result = await jsonotron.queryDocuments({
        roleNames: req.roleNames,
        docTypeName,
        fieldNames: csvStringToArray(req.query.fields),
        docStoreOptions
      })

      res.status(200).json(result.docs)
    }
  }

  return convertErrorsToHttpStatusCodes(handler)
}

module.exports = createCollectionGetHandler
