import { Jsonotron, resolveJsonotronTypeToGraphQLType } from 'jsonotron-js'
import { DocType, RoleType, RoleTypeDocPermissionSet, RoleTypeDocQueryPermissionSet } from 'sengi-interfaces'
import { capitalizeFirstLetter, codeSafeTypeName } from '../utils'

/**
 * Returns true if the field can be queried based on the given role types,
 * otherwise returns false.
 * @param fieldName The name of a field or calculated field.
 * @param docType A doc type.
 * @param roleTypes An array of role types.
 */
function canQueryField (fieldName: string, docType: DocType, roleTypes: RoleType[]): boolean {
  for (const roleType of roleTypes) {
    if (roleType.docPermissions === true) {
      return true
    } else if (typeof roleType.docPermissions === 'object' && roleType.docPermissions[docType.name] === true) {
      return true
    } else if (typeof roleType.docPermissions === 'object' && typeof roleType.docPermissions[docType.name] === 'object') {
      const roleTypeDocPermissionSet = roleType.docPermissions[docType.name] as RoleTypeDocPermissionSet

      if (roleTypeDocPermissionSet.query === true) {
        return true
      } else if (typeof roleTypeDocPermissionSet.query === 'object') {
        const roleTypeDocQueryPermissionSet = roleTypeDocPermissionSet.query as RoleTypeDocQueryPermissionSet

        if (roleTypeDocQueryPermissionSet.fieldsTreatment === 'whitelist' && roleTypeDocQueryPermissionSet.fields.includes(fieldName)) {
          return true
        } else if (roleTypeDocQueryPermissionSet.fieldsTreatment === 'blacklist' && !roleTypeDocQueryPermissionSet.fields.includes(fieldName)) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * Generates a queryable GraphQL type for the given doc type.
 * If none of the properties can be queried due to role permissions
 * then an empty string is returned.
 * @param jsonotron A jsonotron instance.
 * @param docType A doc type.
 * @param roleTypes An array of role types.
 * @param suffix A suffix to apply to the graph QL type name.
 */
export function generateQueryableGraphQLTypeForDocType (jsonotron: Jsonotron, docType: DocType, roleTypes: RoleType[], suffix: string): string {
  const map = jsonotron.getGraphQLMap()

  const propertyLines: string[] = []
  const fieldNames = Object.keys(docType.fields)
  const calcFieldNames = Object.keys(docType.calculatedFields)

  fieldNames.forEach(fieldName => {
    if (canQueryField(fieldName, docType, roleTypes)) {
      const field = docType.fields[fieldName]

      const graphQLPropertyTypeName = resolveJsonotronTypeToGraphQLType(
        jsonotron.getFullyQualifiedTypeName(field.type),
        field.isArray ? 1 : 0,
        map,
        false
      )

      const reqFlag = field.isRequired ? '!' : ''

      propertyLines.push(`  """\n  ${field.documentation}\n  """\n  ${fieldName}: ${graphQLPropertyTypeName}${reqFlag}`)
    }
  })

  calcFieldNames.forEach(calcFieldName => {
    if (canQueryField(calcFieldName, docType, roleTypes)) {
      const calcField = docType.calculatedFields[calcFieldName]

      const graphQLPropertyTypeName = resolveJsonotronTypeToGraphQLType(
        jsonotron.getFullyQualifiedTypeName(calcField.type),
        calcField.isArray ? 1 : 0,
        map,
        false
      )

      propertyLines.push(`  """\n  ${calcField.documentation}\n  """\n  ${calcFieldName}: ${graphQLPropertyTypeName}`)
    }
  })

  if (propertyLines.length > 0) {
    propertyLines.push(`  """\n  The id.\n  """\n  id: String!`)
    propertyLines.push(`  """\n  The type of the doc.\n  """\n  docType: String!`)
    propertyLines.push(`  """\n  The list of operations on the doc.\n  """\n  docOps: [String!]!`)
    propertyLines.push(`  """\n  The version of the doc.\n  """\n  docVersion: String!`)

    const graphQLTypeName = capitalizeFirstLetter(codeSafeTypeName(docType.name)) + suffix
    return `"""\nThe fields of the ${docType.name}(${suffix}) object.\n${docType.summary}\n${docType.documentation}\n"""\ntype ${graphQLTypeName} {\n${propertyLines.join('\n\n')}\n}`
  } else {
    return ''
  }
}
