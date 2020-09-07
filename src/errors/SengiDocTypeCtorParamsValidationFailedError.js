import check from 'check-types'

export class SengiDocTypeCtorParamsValidationFailedError extends Error {
  constructor (docTypeName, errors) {
    check.assert.string(docTypeName)
    check.assert.array.of.object(errors)
    super(`The parameters supplied to the constructor for doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.errors = errors
  }
}
