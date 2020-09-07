import check from 'check-types'
import { SengiUnrecognisedFilterNameError } from '../errors'

/**
 * Ensure that the given filter name is a filter defined
 * on the given document type.
 * @param {Object} docType A document type.
 * @param {String} filterName The name of a filter.
 */
export const ensureFilterName = (docType, filterName) => {
  check.assert.object(docType)
  check.assert.object(docType.filters)
  check.assert.string(filterName)

  if (typeof docType.filters[filterName] !== 'object') {
    throw new SengiUnrecognisedFilterNameError(docType.name, filterName)
  }
}
