import { writeFile } from 'fs/promises'
import { SerializableDocType } from 'sengi-interfaces'
import { SengiClient } from 'sengi-client'

/**
 * Clone the doc types from a remote sengi-based service and store them
 * as a local JSON file.
 * @param serverUrl The url of a jsonoserve server.
 * @param roleName The role name to use for access.
 * @param file The file to write.
 */
export async function clone (serverUrl: string, roleName: string, file: string): Promise<void> {
  // normalise the server url
  const normalisedUrl = serverUrl.endsWith('/') ? serverUrl : serverUrl + '/'
  const docTypesUrl = normalisedUrl + 'docTypes'

  // fetch the list of doc types
  const sengiClient = new SengiClient({ url: docTypesUrl, roleNames: [roleName] })
  const docTypeOverviews = await sengiClient.getDocTypeOverviews()

  // build the list
  const docTypes: SerializableDocType[] = []
  
  // loop over the overviews
  for (const docTypeOverview of docTypeOverviews) {
    // get the serializable doc type
    const docType = await sengiClient.getDocType({ docTypeName: docTypeOverview.name })
    docTypes.push(docType)
  }

  // write the result
  await writeFile(file, JSON.stringify(docTypes, null, 2), 'utf8')
}
