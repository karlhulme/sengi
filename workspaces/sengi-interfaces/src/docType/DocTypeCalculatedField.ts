import { DocTypeCalculatedFieldValue } from './DocTypeCalculatedFieldValue'

export interface DocTypeCalculatedField {
  documentation: string
  inputFields: string[]
  type: string
  isArray?: boolean
  deprecation?: string
  value: DocTypeCalculatedFieldValue
}
