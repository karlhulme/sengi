import { writeFile } from 'fs/promises'
import { ensureDirectory, fetchDocTypes, generateTypedSengiClient } from '../utils'

/**
 * Clone the doc types from a remote sengi-based service and store them
 * as a local JSON file.
 * @param serverUrl The url of a jsonoserve server.
 * @param roleName The role name to use for access.
 * @param file The file to write.
 */
export async function codegen (serverUrl: string, roleName: string, path: string): Promise<void> {
  // fetch the list of doc types
  const docTypes = await fetchDocTypes(serverUrl, roleName)

  // ensure all the directories are created, upto the path
  await ensureDirectory(path)

  // generate a strongly-typed sub-class based on the doc types
  const typedSengiClientCode = generateTypedSengiClient(docTypes)

  // write the result
  await writeFile(path, typedSengiClientCode, 'utf8')
}
