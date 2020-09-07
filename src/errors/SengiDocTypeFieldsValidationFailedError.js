import check from 'check-types'

export class SengiDocTypeFieldsValidationFailedError extends Error {
  constructor (docTypeName, errors) {
    check.assert.string(docTypeName)
    check.assert.array.of.object(errors)
    super(`The values supplied for the fields of doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.errors = errors
  }
}
