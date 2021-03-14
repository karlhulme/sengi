export interface SerializableDocTypeConstructorParameter {
  typeDomain: string
  typeSystem: string
  typeName: string
  isArray?: boolean
  isRequired?: boolean
  deprecated?: string
  documentation: string
}