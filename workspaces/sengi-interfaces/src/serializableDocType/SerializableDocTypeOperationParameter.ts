export interface SerializableDocTypeOperationParameter {
  type: string
  graphQlType: string
  isArray?: boolean
  isRequired?: boolean
  deprecation?: string
  documentation: string
}