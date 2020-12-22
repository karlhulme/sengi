import { DocStoredField } from '../doc'

export interface DocTypeField {
  type: string
  default?: DocStoredField
  isArray?: boolean
  isRequired?: boolean
  deprecation?: string
  canUpdate?: boolean
  documentation: string
}
