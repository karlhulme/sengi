export interface SerializableDocTypeConstructorParameter {
  type: string
  graphQlType: string
  isArray?: boolean
  isRequired?: boolean
  deprecated?: string
  documentation: string
}