import { DocStoredField } from 'sengi-interfaces'

/**
 * Represents a document stored in the Mongo database.
 */
export type MongoDbDoc = Record<string, DocStoredField> & {
  /**
   * The id of the document.
   */
  _id: string,

  /**
   * The type of the document.
   */
  docType: string,

  /**
   * The version of the document.
   */
  docVersion: string,

  /**
   * An array of operation ids that have been applied to the document.
   */
  docOpIds: string[]
}
