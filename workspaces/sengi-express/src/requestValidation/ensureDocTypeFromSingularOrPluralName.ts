import { AnyDocType } from 'sengi-interfaces'
import { SengiExpressUnrecognisedDocTypeNameError } from '../errors'

/**
 * Returns the singular doc type name for the given plural name.
 * If the plural name cannot be resolved then an error is raised.
 * @param docTypes An array of doc types.
 * @param docTypeSingularOrPluralName The singular or plural name of a doc type.
 */
export function ensureDocTypeFromSingularOrPluralName (docTypes: AnyDocType[], docTypeSingularOrPluralName: string): AnyDocType {
  const docType = docTypes.find(d => d.pluralName === docTypeSingularOrPluralName || d.name === docTypeSingularOrPluralName)

  if (!docType) {
    throw new SengiExpressUnrecognisedDocTypeNameError(docTypeSingularOrPluralName)
  }

  return docType
}
