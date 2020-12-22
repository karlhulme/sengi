import { DocType, Deprecations } from 'sengi-interfaces'

/**
 * Returns an object where each key represents a deprecated field.
 * The value of each key is an object with a reason property that describes
 * why the field was deprecated and/or which field to use instead.
 * @param docType A document type.
 * @param retrievalFieldNames An array of field names.
 */
export function getDeprecationsForRetrievalFieldNames (docType: DocType, retrievalFieldNames: string[]): Deprecations {
  const deprecations: Deprecations = {}

  for (let i = 0; i < retrievalFieldNames.length; i++) {
    const retrievalFieldName = retrievalFieldNames[i]

    // field will be undefined for system field names
    const field = docType.fields[retrievalFieldName]

    if (field && field.deprecation) {
      deprecations[retrievalFieldName] = { reason: field.deprecation }
    }
  }

  return deprecations
}
