import check from 'check-types'
import { SengiInvalidOperationMergePatchError } from '../errors'
import { systemFieldNames } from 'sengi-validation'

/**
 * Raises an error if the given patch references
 * any of the system fields.
 * @param {String} docTypeName The name of a doc type.
 * @param {String} operationName The name of the operation that generated the patch.
 * @param {Object} patch A patch object.
 */
export const ensureOperationMergePatchAvoidsSystemFields = (docTypeName, operationName, patch) => {
  check.assert.string(docTypeName)
  check.assert.string(operationName)
  check.assert.object(patch)

  for (const patchKey in patch) {
    if (systemFieldNames.includes(patchKey)) {
      throw new SengiInvalidOperationMergePatchError(docTypeName, operationName, `Cannot reference a system field '${patchKey}'.`)
    }
  }
}
