import check from 'check-types'

export class SengiDocTypeOperationParamsValidationFailedError extends Error {
  constructor (docTypeName, operationName, errors) {
    check.assert.string(docTypeName)
    check.assert.string(operationName)
    check.assert.array.of.object(errors)
    super(`The parameters supplied to operation '${operationName}' for doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.operationName = operationName
    this.errors = errors
  }
}
