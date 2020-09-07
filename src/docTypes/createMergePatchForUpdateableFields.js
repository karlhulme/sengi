import check from 'check-types'
import { SengiInvalidMergePatchError } from '../errors'

/**
 * Returns a subset of the given patch, such that the keys on the
 * returned patch all reference declared updateable fields on the
 * given doc type.  This method raises an error if the given patch
 * references a non-updateable field or a calculated field.
 * @param {Object} docType A document type.
 * @param {Object} patch A patch object.
 */
export const createMergePatchForUpdateableFields = (docType, patch) => {
  check.assert.object(docType)
  check.assert.object(docType.fields)
  check.assert.object(docType.calculatedFields)
  check.assert.object(patch)

  const patchKeys = Object.keys(patch)
  const safePatch = {}

  for (const patchKey of patchKeys) {
    if (typeof docType.calculatedFields[patchKey] !== 'undefined') {
      throw new SengiInvalidMergePatchError(`Cannot reference a calculated field '${patchKey}'.`)
    }

    if (typeof docType.fields[patchKey] !== 'undefined') {
      if (docType.fields[patchKey].canUpdate === true) {
        safePatch[patchKey] = patch[patchKey]
      } else {
        throw new SengiInvalidMergePatchError(`Cannot reference a non-updateable field '${patchKey}'.`)
      }
    }
  }

  return safePatch
}
