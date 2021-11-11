import { DocPatch } from '../doc/DocPatch'

/**
 * Represents the properties passed to a function that authorises the
 * patching of a document.
 */
export interface DocTypePatchAuthProps<Doc, User> {
  /**
   * The user that made the request.
   */
  user: User

  /**
   * A list of the fields that are to be updated by the patch.
   */
  fieldNames: string[]

  /**
   * The document to be updated, prior to the patch being applied.
   */
  originalDoc: Doc

  /**
   * The details of the patch.
   */
  patch: DocPatch
}
