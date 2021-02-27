/**
 * Returns the given doc type name with characters
 * that cannot appear within source code converted
 * to an underscore.
 * @param docTypeName The name of a doc type.
 */
export function getSafeDocTypeName (docTypeName: string): string {
  return docTypeName.replace(/./g, '_')
}
