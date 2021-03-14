import { Doc, DocType, SengiDocValidationFailedError } from 'sengi-interfaces'
import { Jsonotron } from 'jsonotron-js'
import { Field, Structure } from 'jsonotron-interfaces'

/**
 * Create a validation structure.
 * @param docType A doc type.
 */
function createValidationStructure (docType: DocType): Structure {
  const structure: Record<string, Field> = {}

  for (const fieldName in docType.fields) {
    const field = docType.fields[fieldName]
    
    structure[fieldName] = {
      type: field.type,
      isArray: field.isArray,
      isNullable: false,
      isRequired: field.isRequired
    }
  }

  for (const fieldName in docType.calculatedFields) {
    const calcField = docType.calculatedFields[fieldName]
    
    structure[fieldName] = {
      type: calcField.type,
      isArray: calcField.isArray,
      isNullable: false,
      isRequired: false
    }
  }

  return structure
}

/**
 * Raises an error if the given doc does not conform to the doc type
 * fields and calculated fields specification.
 * Fields not defined on the doc type (including the system fields) are ignored.
 * @param jsonotron A jsonotron type system.
 * @param validatorCache A cache of structures built from previous calls.
 * @param docType A doc type.
 * @param doc A doc to validate.
 */
export function ensureDoc (jsonotron: Jsonotron, validatorCache: Record<string, Structure>, docType: DocType, doc: Doc): void {
  const key = `[${docType.name}].fields`

  if (!validatorCache[key]) {
    validatorCache[key] = createValidationStructure(docType)
  }

  const structure = validatorCache[key]
  const result = jsonotron.validateStructure(structure, doc)

  if (!result.validated) {
    throw new SengiDocValidationFailedError(docType.name, result.fields)
  }
}
