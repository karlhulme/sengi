import check from 'check-types'
import { systemFieldNames } from 'sengi-validation'
import { SengiUnrecognisedFieldNameError } from '../errors'
import { isDeclaredFieldName } from './isDeclaredFieldName'
import { isCalculatedFieldName } from './isCalculatedFieldName'

/**
 * Determines the names of the fields that need to be retrieved
 * to satisfy the required field names.
 * @param {Object} docType A doc type.
 * @param {Array} requiredFieldNames An array of field names.
 */
export const determineFieldNamesForRetrieval = (docType, requiredFieldNames) => {
  check.assert.object(docType)
  check.assert.string(docType.name)
  check.assert.array.of.string(requiredFieldNames)

  const result = []

  for (let i = 0; i < requiredFieldNames.length; i++) {
    const fieldName = requiredFieldNames[i]

    const isSystemFN = systemFieldNames.includes(fieldName)
    const isDeclaredFN = isDeclaredFieldName(docType, fieldName)
    const isCalculatedFN = isCalculatedFieldName(docType, fieldName)

    if (isSystemFN || isDeclaredFN) {
      if (!result.includes(fieldName)) {
        result.push(fieldName)
      }
    } else if (isCalculatedFN) {
      const sourceFieldNames = docType.calculatedFields[fieldName].inputFields || []

      for (const sourceFieldName of sourceFieldNames) {
        if (!result.includes(sourceFieldName)) {
          result.push(sourceFieldName)
        }
      }
    } else {
      throw new SengiUnrecognisedFieldNameError(docType.name, requiredFieldNames[i])
    }
  }

  return result
}
