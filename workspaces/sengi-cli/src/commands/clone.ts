import { writeFile } from 'fs/promises'
import { fetchDocTypes, ensureDirectory } from '../utils'

/**
 * Clone the doc types from a remote sengi-based service and store them
 * as a local JSON file.
 * @param serverUrl The url of a jsonoserve server.
 * @param roleName The role name to use for access.
 * @param file The file to write.
 */
export async function clone (serverUrl: string, roleName: string, path: string): Promise<void> {
  // fetch the list of doc types
  const docTypes = await fetchDocTypes(serverUrl, roleName)

  // ensure all the directories are created, upto the path
  ensureDirectory(path)

  // write the result
  await writeFile(path, JSON.stringify(docTypes, null, 2), 'utf8')
}
