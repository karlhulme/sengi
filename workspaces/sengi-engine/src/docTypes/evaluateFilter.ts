import { DocType, DocFragment, SengiUnrecognisedFilterNameError, SengiFilterFailedError } from 'sengi-interfaces'

/**
 * Evaluate a doc type filter.
 * @param docType A doc type.
 * @param filterName The name of a filter.
 * @param filterParams A parameter object to be passed to the filter.
 */
export function evaluateFilter (docType: DocType, filterName: string, filterParams: DocFragment): unknown  {
  const filter = docType.filters[filterName]

  if (!filter) {
    throw new SengiUnrecognisedFilterNameError(docType.name, filterName)
  }

  try {
    return filter.implementation(filterParams)
  } catch (err) {
    throw new SengiFilterFailedError(docType.name, filterName, err)
  }
}
