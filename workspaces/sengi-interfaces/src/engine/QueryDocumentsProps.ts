import { DocStoreOptions } from '../docStore'
import { RequestProps } from './RequestProps'

export interface QueryDocumentsProps {
  roleNames: string[]
  docTypeName: string
  fieldNames: string[]
  reqProps: RequestProps
  docStoreOptions: DocStoreOptions
  limit?: number
  offset?: number
}
