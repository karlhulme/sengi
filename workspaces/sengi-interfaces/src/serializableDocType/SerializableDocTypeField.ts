import { DocStoredField } from '../doc'

export interface SerializableDocTypeField {
  typeDomain: string
  typeSystem: string
  typeName: string
  default?: DocStoredField
  isArray?: boolean
  isRequired?: boolean
  deprecation?: string
  canUpdate?: boolean
  documentation: string
}
