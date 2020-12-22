import { DocStoreOptions } from '../docStore'
import { RequestProps } from './RequestProps'

export interface QueryDocumentsByIdsProps {
  roleNames: string[]
  docTypeName: string
  fieldNames: string[]
  ids: string[]
  reqProps: RequestProps
  docStoreOptions: DocStoreOptions
}
