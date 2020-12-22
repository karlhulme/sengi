import { DocStoreOptions, DocType } from 'sengi-interfaces'

/**
 * Returns an object that combines the given request options with
 * the options defined for the doc store on the doc type.
 * @param docType A doc type.
 * @param requestOptions An object keyed with options provided in a request.
 */
export function createDocStoreOptions (docType: DocType, requestOptions: Record<string, unknown>): DocStoreOptions {
  return Object.assign({}, requestOptions, docType.docStoreOptions)
}
