import { Doc, DocPatch } from 'sengi-interfaces'

/**
 * Applies the given patch to the given subject.
 * @param doc The doc that will be patched.
 * @param patch A patch object.
 */
export function applyPatch (doc: Doc, patch: DocPatch): void {
  const patchKeys = Object.keys(patch)

  for (const patchKey of patchKeys) {
    const patchValue = patch[patchKey]

    if (patchValue === null) {
      delete doc[patchKey]
    } else {
      doc[patchKey] = patchValue
    }
  }
}
