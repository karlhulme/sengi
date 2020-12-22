import { Doc, DocPatch } from 'sengi-interfaces'

/**
 * Applies the given patch to the given subject.
 * @param subject The subject that will be patched.
 * @param patch A patch object.
 */
export function applyMergePatch (subject: Doc, patch: DocPatch): void {
  const patchKeys = Object.keys(patch)

  for (const patchKey of patchKeys) {
    const patchValue = patch[patchKey]
    const subjectValue = subject[patchKey]

    if (patchValue === null) {
      delete subject[patchKey]
    } else if (typeof patchValue === 'number' || typeof patchValue === 'boolean' || typeof patchValue === 'string' || Array.isArray(patchValue)) {
      subject[patchKey] = patchValue
    } else {
      if (typeof subjectValue !== 'object' || Array.isArray(subjectValue)) {
        subject[patchKey] = {}
      }

      applyMergePatch(subject[patchKey] as Doc, patch[patchKey] as DocPatch)
    }
  }
}
