import { DocFragment, DocType, SengiOperationParamsValidationFailedError } from 'sengi-interfaces'
import { Jsonotron } from 'jsonotron-js'
import { Field, Structure } from 'jsonotron-interfaces'

/**
 * Create a validation structure.
 * @param docType A doc type.
 * @param operationName The name of an operation.
 */
function createValidationStructure (docType: DocType, operationName: string): Structure {
  const structure: Record<string, Field> = {}

  if (typeof docType.operations[operationName] === 'object') {
    for (const operationParamName in docType.operations[operationName].parameters) {
      const operationParam = docType.operations[operationName].parameters[operationParamName]
      
      structure[operationParamName] = {
        type: operationParam.type,
        isArray: operationParam.isArray,
        isNullable: false,
        isRequired: operationParam.isRequired
      }
    }
  }

  return structure
}

/**
 * Raises an error if the given operation params object does not
 * conform to the doc type operation parameters specification.
 * Parameters not defined on the operation are ignored.
 * @param jsonotron A jsonotron type system.
 * @param validatorCache A cache of structures built from previous calls.
 * @param docType A doc type.
 * @param operationName The name of an operation.
 * @param operationParams A set of operation params to validate.
 */
export function ensureOperationParams (jsonotron: Jsonotron, validatorCache: Record<string, Structure>, docType: DocType, operationName: string, operationParams: DocFragment): void {
  const key = `[${docType.name}].operations[${operationName}].parameters`

  if (!validatorCache[key]) {
    validatorCache[key] = createValidationStructure(docType, operationName)
  }

  const structure = validatorCache[key]
  const result = jsonotron.validateStructure(structure, operationParams)

  if (!result.validated) {
    throw new SengiOperationParamsValidationFailedError(docType.name, operationName, result.fields)
  }
}
