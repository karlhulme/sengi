import { Jsonotron, resolveJsonotronTypeToGraphQLType } from 'jsonotron-js'
import { DocType } from 'sengi-interfaces'
import { capitalizeFirstLetter, codeSafeTypeName } from '../utils'

/**
 * Generates a patch GraphQL input for the given doc type.
 * @param jsonotron A jsonotron instance.
 * @param docType A doc type.
 */
export function generatePatchGraphQLTypeForDocType (jsonotron: Jsonotron, docType: DocType): string {
  const map = jsonotron.getGraphQLMap()
  const propertyLines: string[] = []

  const fieldNames = Object.keys(docType.fields)

  fieldNames.forEach(fieldName => {
    const field = docType.fields[fieldName]

    if (field.canUpdate) {
      const graphQLPropertyTypeName = resolveJsonotronTypeToGraphQLType(
        jsonotron.getFullyQualifiedTypeName(field.type),
        field.isArray ? 1 : 0,
        map,
        true
      )

      // ignore isRequired flag because patching is just adjusting existing fields.
      // or potentially deleting them (by passing null)

      propertyLines.push(`  """\n  ${field.documentation}\n  """\n  ${fieldName}: ${graphQLPropertyTypeName}`)
    }
  })

  if (propertyLines.length > 0) {
    const graphQLTypeName = capitalizeFirstLetter(codeSafeTypeName(docType.name)) + 'PatchProps'
    return `"""\nThe fields of the ${docType.name} object that can be patched.\n"""\ninput ${graphQLTypeName} {\n${propertyLines.join('\n\n')}\n}`
  } else {
    return ''
  }
}
