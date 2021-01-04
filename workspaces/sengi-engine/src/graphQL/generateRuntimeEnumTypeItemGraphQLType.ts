/**
 * Returns the GraphQL type definition for a runtime enum type item.
 */
export function generateRuntimeEnumTypeItemGraphQLType (): string {
  return `
"""
A value from an enumeration.
"""
type EnumTypeItem {
  """
  The underlying value.
  """
  value: String!

  """
  The display text.
  """
  text: String!

  """
  A symbol associated with the enum value.
  """
  symbol: String

  """
  Populated if the enum value is deprecated, explaining the reason for the deprecation and/or the value to use in it's place.
  """
  deprecated: String

  """
  Explains the intended usage of the enumeration value.
  """
  documentation: String
}
`
}