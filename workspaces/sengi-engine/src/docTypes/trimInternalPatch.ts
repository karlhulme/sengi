import { DocType, DocPatch } from 'sengi-interfaces'

/**
 * Returns a new patch containing only the declared and calculated fields.
 * This trim should be used before applying a patch that has been created
 * by an operation to ensure that system fields are not affected.
 * @param docType A document type.
 * @param patch A patch.
 */
export function trimInternalPatch (docType: DocType, patch: DocPatch): DocPatch {
  const reducedPatch: DocPatch = {}

  for (const fieldName in patch) {
    const isDeclaredField = typeof docType.fields[fieldName] === 'object'
    const isCalculatedField = typeof docType.calculatedFields[fieldName] === 'object'

    if (isDeclaredField || isCalculatedField) {
      reducedPatch[fieldName] = patch[fieldName]
    }
  }

  return reducedPatch
}
