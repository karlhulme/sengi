import { DocPatch, DocSystemFieldNames, DocType, SengiPatchValidationFailedError, ValidationError } from 'sengi-interfaces'
import { Field, Jsonotron, Structure } from 'jsonotron-js'

/**
 * Create a validation structure.
 * @param docType A doc type.
 */
function createValidationStructure (docType: DocType): Structure {
  const structure: Record<string, Field> = {}

  for (const fieldName in docType.fields) {
    const field = docType.fields[fieldName]
    
    if (field.canUpdate) {
      structure[fieldName] = {
        type: field.type,
        isArray: field.isArray,
        isNullable: !field.isRequired,
        isRequired: false
      }
    }
  }

  return structure
}

/**
 * Raises an error if the given patch attempts to update system fields,
 * non-updateable declared fields or calculated fields, or attempts
 * to set updateable declared fields with values of incorrect types.
 * @param jsonotron A jsonotron type system.
 * @param validatorCache A cache of structures built from previous calls.
 * @param docType A doc type.
 * @param patch A patch to validate.
 */
export function ensurePatch (jsonotron: Jsonotron, validatorCache: Record<string, Structure>, docType: DocType, patch: DocPatch): void {
  const validationErrors: ValidationError[] = []

  for (const fieldName in patch) {
    if (DocSystemFieldNames.includes(fieldName)) {
      validationErrors.push({ name: fieldName, message: 'Cannot patch a system field.'})
    } else if (typeof docType.fields[fieldName] === 'object' && !docType.fields[fieldName].canUpdate) {
      validationErrors.push({ name: fieldName, message: 'Cannot patch a field unless it is marked with canUpdate flag.'})
    } else if (typeof docType.calculatedFields[fieldName] === 'object') {
      validationErrors.push({ name: fieldName, message: 'Cannot patch a calculated field.'})
    }
  }

  const key = `[${docType.name}].patch`

  if (!validatorCache[key]) {
    validatorCache[key] = createValidationStructure(docType)
  }

  const structure = validatorCache[key]
  const result = jsonotron.validateStructure(structure, patch)

  if (!result.validated) {
    validationErrors.push(...result.fields)
  }

  if (validationErrors.length > 0) {
    throw new SengiPatchValidationFailedError(docType.name, validationErrors)
  }
}
