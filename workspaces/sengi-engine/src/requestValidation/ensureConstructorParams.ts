import { DocFragment, DocType, SengiCtorParamsValidationFailedError } from 'sengi-interfaces'
import { Field, Jsonotron, Structure } from 'jsonotron-js'

/**
 * Create a validation structure.
 * @param docType A doc type.
 */
function createValidationStructure (docType: DocType): Structure {
  const structure: Record<string, Field> = {}

  for (const ctorParamName in docType.ctor.parameters) {
    const ctorParam = docType.ctor.parameters[ctorParamName]
    
    structure[ctorParamName] = {
      type: ctorParam.type,
      isArray: ctorParam.isArray,
      isNullable: false,
      isRequired: ctorParam.isRequired
    }
  }

  for (const fieldName in docType.fields) {
    const field = docType.fields[fieldName]
    
    if (field.canUpdate) {
      structure[fieldName] = {
        type: field.type,
        isArray: field.isArray,
        isNullable: false,
        isRequired: false
      }
    }
  }

  return structure
}

/**
 * Raises an error if the given constructor params object does not
 * conform to the doc type constructor parameters specification.
 * Parameters and fields not defined on the doc type are ignored.
 * @param jsonotron A jsonotron type system.
 * @param validatorCache A cache of structures built from previous calls.
 * @param docType A doc type.
 * @param constructorParams A set of constructor params to validate.
 */
export function ensureConstructorParams (jsonotron: Jsonotron, validatorCache: Record<string, Structure>, docType: DocType, constructorParams: DocFragment): void {
  const key = `[${docType.name}].ctor.parameters`

  if (!validatorCache[key]) {
    validatorCache[key] = createValidationStructure(docType)
  }

  const structure = validatorCache[key]
  const result = jsonotron.validateStructure(structure, constructorParams)

  if (!result.validated) {
    throw new SengiCtorParamsValidationFailedError(docType.name, result.fields)
  }
}
