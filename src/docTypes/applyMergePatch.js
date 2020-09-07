import check from 'check-types'

/**
 * Applies the given patch to the given subject.
 * @param {Object} subject The subject that will be patched.
 * @param {Object} patch A patch object.
 */
export const applyMergePatch = (subject, patch) => {
  check.assert.object(subject)

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

      applyMergePatch(subject[patchKey], patch[patchKey])
    }
  }

  return subject
}
