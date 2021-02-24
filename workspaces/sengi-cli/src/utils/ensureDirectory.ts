import { mkdir } from 'fs/promises'

/**
 * Ensures that the directory for the given path exists.
 * @param path A file path.
 */
export async function ensureDirectory (path: string): Promise<void> {
  const lastDividerIndex = path.lastIndexOf('/')
  await mkdir(path.slice(0, lastDividerIndex), { recursive: true })
}
