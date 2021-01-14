import { Jsonotron, resolveJsonotronTypeToGraphQLType } from 'jsonotron-js'
import { DocType } from 'sengi-interfaces'
import { capitalizeFirstLetter, codeSafeTypeName } from '../utils'

/**
 * Generates an operation GraphQL input for the given doc type.
 * @param jsonotron A jsonotron instance.
 * @param docType A doc type.
 * @param operationName The name of an operation.
 */
export function generateOperationGraphQLTypeForDocType (jsonotron: Jsonotron, docType: DocType, operationName: string): string {
  const map = jsonotron.getGraphQLMap()
  const propertyLines: string[] = []

  const operation = docType.operations[operationName]

  if (!operation) {
    return ''
  }

  const operationParamNames = Object.keys(operation.parameters)

  operationParamNames.forEach(operationParamName => {
    const operationParam = operation.parameters[operationParamName]

    const graphQLPropertyTypeName = resolveJsonotronTypeToGraphQLType(
      jsonotron.getFullyQualifiedTypeName(operationParam.type),
      operationParam.isArray ? 1 : 0,
      map,
      true
    )

    // ignore isRequired flag because middleware (e.g. lambda/functions service) may provide that value.

    propertyLines.push(`  """\n  ${operationParam.documentation}\n  """\n  ${operationParamName}: ${graphQLPropertyTypeName}`)
  })

  if (propertyLines.length > 0) {
    const graphQLTypeName = capitalizeFirstLetter(codeSafeTypeName(docType.name)) + capitalizeFirstLetter(operationName) + 'Props'
    return `"""\nThe parameters of the ${operationName} operation of the ${docType.name} object.\n"""\ninput ${graphQLTypeName} {\n${propertyLines.join('\n\n')}\n}`
  } else {
    return ''
  }
}
