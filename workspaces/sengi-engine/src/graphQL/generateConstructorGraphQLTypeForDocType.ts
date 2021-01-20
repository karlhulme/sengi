import { Jsonotron } from 'jsonotron-js'
import { DocType } from 'sengi-interfaces'
import { capitalizeFirstLetter, codeSafeTypeName } from '../utils'

/**
 * Generates a constructor GraphQL input for the given doc type.
 * @param jsonotron A jsonotron instance.
 * @param docType A doc type.
 */
export function generateConstructorGraphQLTypeForDocType (jsonotron: Jsonotron, docType: DocType): string {
  const propertyLines: string[] = []

  const ctorParamNames = Object.keys(docType.ctor.parameters)

  ctorParamNames.forEach(ctorParamName => {
    const ctorParam = docType.ctor.parameters[ctorParamName]

    const graphQLPropertyTypeName = jsonotron.getGraphQLPrimitiveType({ typeName: ctorParam.type, isArray: ctorParam.isArray })

    // ignore isRequired flag because middleware (e.g. lambda/functions service) may provide that value. - (parameterise would be better)

    propertyLines.push(`  """\n  ${ctorParam.documentation}\n  """\n  ${ctorParamName}: ${graphQLPropertyTypeName}`)
  })

  const fieldNames = Object.keys(docType.fields)

  fieldNames.forEach(fieldName => {
    const field = docType.fields[fieldName]

    if (field.canUpdate) {
      const graphQLPropertyTypeName = jsonotron.getGraphQLPrimitiveType({ typeName: field.type, isArray: field.isArray })

      // ignore isRequired flag because we are calling the constructor, which should set any required fields
      // and these are optional additional fields to patch-in afterwards.

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
