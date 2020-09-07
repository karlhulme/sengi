import check from 'check-types'

export class SengiDocTypePatchValidationFailedError extends Error {
  constructor (docTypeName, errors) {
    check.assert.string(docTypeName)
    check.assert.array.of.object(errors)
    super(`The parameters supplied for a patch for doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.errors = errors
  }
}
