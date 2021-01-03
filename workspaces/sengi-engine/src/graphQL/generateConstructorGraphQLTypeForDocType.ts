import { Jsonotron, resolveJsonotronTypeToGraphQLType } from 'jsonotron-js'
import { DocType } from 'sengi-interfaces'
import { capitalizeFirstLetter, codeSafeTypeName } from '../utils'

/**
 * Generates a constructor GraphQL input for the given doc type.
 * @param jsonotron A jsonotron instance.
 * @param docType A doc type.
 */
export function generateConstructorGraphQLTypeForDocType (jsonotron: Jsonotron, docType: DocType): string {
  const map = jsonotron.getGraphQLMap()
  const propertyLines: string[] = []

  const ctorParamNames = Object.keys(docType.ctor.parameters)

  ctorParamNames.forEach(ctorParamName => {
    const ctorParam = docType.ctor.parameters[ctorParamName]

    const graphQLPropertyTypeName = resolveJsonotronTypeToGraphQLType(
      jsonotron.getFullyQualifiedTypeName(ctorParam.type),
      ctorParam.isArray ? 1 : 0,
      map,
      true
    )

    const reqFlag = ctorParam.isRequired ? '!' : ''

    propertyLines.push(`  """\n  ${ctorParam.documentation}\n  """\n  ${ctorParamName}: ${graphQLPropertyTypeName}${reqFlag}`)
  })

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

      // ignore isRequired flag because constructor implementation should ensure
      // that the constructor params are enough to create the doc.

      propertyLines.push(`  """\n  ${field.documentation}\n  """\n  ${fieldName}: ${graphQLPropertyTypeName}`)
    }
  })

  if (propertyLines.length > 0) {
    const graphQLTypeName = capitalizeFirstLetter(codeSafeTypeName(docType.name)) + 'ConstructorProps'
    return `"""\nThe constructor parameters of the ${docType.name} object.\n"""\ninput ${graphQLTypeName} {\n${propertyLines.join('\n\n')}\n}`
  } else {
    return ''
  }
}
