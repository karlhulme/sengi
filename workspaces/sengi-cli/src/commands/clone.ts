import { mkdir, writeFile } from 'fs/promises'
import { SerializableDocType } from 'sengi-interfaces'
import { SengiClient } from 'sengi-client'

/**
 * Clone the doc types from a remote sengi-based service and store them
 * as a local JSON file.
 * @param serverUrl The url of a jsonoserve server.
 * @param roleName The role name to use for access.
 * @param file The file to write.
 */
export async function clone (serverUrl: string, roleName: string, path: string): Promise<void> {
  // fetch the list of doc types
  const sengiClient = new SengiClient({ url: serverUrl, roleNames: [roleName] })
  const docTypeOverviews = await sengiClient.getDocTypeOverviews()

  // ensure all the directories are created, upto the path
  const lastDividerIndex = path.lastIndexOf('/')
  await mkdir(path.slice(0, lastDividerIndex), { recursive: true })

  // build the list
  const docTypes: SerializableDocType[] = []
  
  // loop over the overviews
  for (const docTypeOverview of docTypeOverviews) {
    // get the serializable doc type
    const docType = await sengiClient.getDocType({ docTypeName: docTypeOverview.name })
    docTypes.push(docType)
  }

  // write the result
  await writeFile(path, JSON.stringify(docTypes, null, 2), 'utf8')
}
