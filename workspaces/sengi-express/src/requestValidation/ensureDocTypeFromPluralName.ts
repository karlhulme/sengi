import { DocType } from 'sengi-interfaces'
import { SengiExpressUnrecognisedDocTypePluralNameError } from '../errors'

/**
 * Returns the singular doc type name for the given plural name.
 * If the plural name cannot be resolved then an error is raised.
 * @param docTypes An array of doc types.
 * @param docTypePluralName The plural name of a doc type.
 */
export function ensureDocTypeFromPluralName (docTypes: DocType[], docTypePluralName: string): DocType {
  const docType = docTypes.find(d => d.pluralName === docTypePluralName)

  if (!docType) {
    throw new SengiExpressUnrecognisedDocTypePluralNameError(docTypePluralName)
  }

  return docType
}
