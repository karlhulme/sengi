import { DocStoredField } from './DocStoredField'

/**
 * Represents a document.
 * This type includes the fields that must be present on a document to
 * be managed and stored by the Sengi system.
 */
export type Doc = Record<string, DocStoredField> & {
  /**
   * The id of the document.
   */
  id: string
  
  /**
   * The document type.
   */
  docType: string
  
  /**
   * The version of the document
   */
  docVersion: string
  
  /**
   * An array of operation ids that have been applied to this document.
   */
  docOpIds: string[]
}
