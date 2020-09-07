import check from 'check-types'
import { systemFieldNames } from 'sengi-validation'
import { JsonotronInvalidMergePatchError } from '../jsonotron-errors'

/**
 * Raises an error if the given patch references
 * any of the system fields.
 * @param {Object} patch A patch object.
 */
export const ensureMergePatchAvoidsSystemFields = patch => {
  check.assert.object(patch)

  for (const patchKey in patch) {
    if (systemFieldNames.includes(patchKey)) {
      throw new JsonotronInvalidMergePatchError(`Cannot reference a system field '${patchKey}'.`)
    }
  }
}
