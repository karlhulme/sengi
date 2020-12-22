import { DocType, SengiUnrecognisedFilterNameError } from 'sengi-interfaces'

/**
 * Ensure that the given filter name is a filter defined
 * on the given document type.
 * @param docType A document type.
 * @param filterName The name of a filter.
 */
export function ensureFilterName (docType: DocType, filterName: string): void {
  if (typeof docType.filters[filterName] !== 'object') {
    throw new SengiUnrecognisedFilterNameError(docType.name, filterName)
  }
}
