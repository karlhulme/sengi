import { DocFragment, DocType, SengiAggregateParamsValidationFailedError } from 'sengi-interfaces'
import { Field, Jsonotron, Structure } from 'jsonotron-js'

/**
 * Create a validation structure.
 * @param docType A doc type.
 * @param aggregateName The name of a aggregate.
 */
function createValidationStructure (docType: DocType, aggregateName: string): Structure {
  const structure: Record<string, Field> = {}

  if (typeof docType.aggregates[aggregateName] === 'object') {
    for (const aggregateParamName in docType.aggregates[aggregateName].parameters) {
      const aggregateParam = docType.aggregates[aggregateName].parameters[aggregateParamName]
      
      structure[aggregateParamName] = {
        type: aggregateParam.type,
        isArray: aggregateParam.isArray,
        isNullable: false,
        isRequired: aggregateParam.isRequired
      }
    }
  }

  return structure
}

/**
 * Raises an error if the given aggregate params object does not
 * conform to the doc type aggregate parameters specification.
 * Parameters not defined on the aggregate are ignored.
 * @param jsonotron A jsonotron type system.
 * @param validatorCache A cache of structures built from previous calls.
 * @param docType A doc type.
 * @param aggregateName The name of an aggregate.
 * @param aggregateParams A set of aggregate params to validate.
 */
export function ensureAggregateParams (jsonotron: Jsonotron, validatorCache: Record<string, Structure>, docType: DocType, aggregateName: string, aggregateParams: DocFragment): void {
  const key = `[${docType.name}].aggregates[${aggregateName}].parameters`

  if (!validatorCache[key]) {
    validatorCache[key] = createValidationStructure(docType, aggregateName)
  }

  const structure = validatorCache[key]
  const result = jsonotron.validateStructure(structure, aggregateParams)

  if (!result.validated) {
    throw new SengiAggregateParamsValidationFailedError(docType.name, aggregateName, result.fields)
  }
}
