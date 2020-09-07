import check from 'check-types'

export class SengiDocTypeFilterParamsValidationFailedError extends Error {
  constructor (docTypeName, filterName, errors) {
    check.assert.string(docTypeName)
    check.assert.string(filterName)
    check.assert.array.of.object(errors)
    super(`The parameters supplied to filter '${filterName}' for doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.filterName = filterName
    this.errors = errors
  }
}
