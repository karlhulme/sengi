export interface SerializableDocTypeOperationParameter {
  typeDomain: string
  typeSystem: string
  typeName: string
  isArray?: boolean
  isRequired?: boolean
  deprecation?: string
  documentation: string
}
