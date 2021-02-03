import { DocStoredField } from '../doc'

export interface SerializableDocTypeField {
  type: string
  graphQlType: string
  default?: DocStoredField
  isArray?: boolean
  isRequired?: boolean
  deprecation?: string
  canUpdate?: boolean
  documentation: string
}
