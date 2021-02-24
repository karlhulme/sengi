import { SerializableDocType } from 'sengi-interfaces'
import { SengiClient } from 'sengi-client'

/**
 * Returns the list of doc types from the server.
 * @param serverUrl The url of the sengi server.
 * @param roleName The role to use when accessing the server.
 */
export async function fetchDocTypes (serverUrl: string, roleName: string): Promise<SerializableDocType[]> {
  // fetch the list of doc types
  const sengiClient = new SengiClient({ url: serverUrl, roleNames: [roleName] })
  const docTypeOverviews = await sengiClient.getDocTypeOverviews()

  // build the list
  const docTypes: SerializableDocType[] = []
  
  // loop over the overviews
  for (const docTypeOverview of docTypeOverviews) {
    // get the serializable doc type
    const docType = await sengiClient.getDocType({ docTypeName: docTypeOverview.name })
    docTypes.push(docType)
  }

  return docTypes
}
