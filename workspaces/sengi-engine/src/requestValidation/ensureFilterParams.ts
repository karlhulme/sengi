import { DocFragment, DocType, SengiFilterParamsValidationFailedError } from 'sengi-interfaces'
import { Jsonotron } from 'jsonotron-js'
import { Field, Structure } from 'jsonotron-interfaces'

/**
 * Create a validation structure.
 * @param docType A doc type.
 * @param filterName The name of a filter.
 */
function createValidationStructure (docType: DocType, filterName: string): Structure {
  const structure: Record<string, Field> = {}

  if (typeof docType.filters[filterName] === 'object') {
    for (const filterParamName in docType.filters[filterName].parameters) {
      const filterParam = docType.filters[filterName].parameters[filterParamName]
      
      structure[filterParamName] = {
        type: filterParam.type,
        isArray: filterParam.isArray,
        isNullable: false,
        isRequired: filterParam.isRequired
      }
    }
  }

  return structure
}

/**
 * Raises an error if the given filter params object does not
 * conform to the doc type filter parameters specification.
 * Parameters not defined on the filter are ignored.
 * @param jsonotron A jsonotron type system.
 * @param validatorCache A cache of structures built from previous calls.
 * @param docType A doc type.
 * @param filterName The name of a filter.
 * @param filterParams A set of filter params to validate.
 */
export function ensureFilterParams (jsonotron: Jsonotron, validatorCache: Record<string, Structure>, docType: DocType, filterName: string, filterParams: DocFragment): void {
  const key = `[${docType.name}].filters[${filterName}].parameters`

  if (!validatorCache[key]) {
    validatorCache[key] = createValidationStructure(docType, filterName)
  }

  const structure = validatorCache[key]
  const result = jsonotron.validateStructure(structure, filterParams)

  if (!result.validated) {
    throw new SengiFilterParamsValidationFailedError(docType.name, filterName, result.fields)
  }
}
