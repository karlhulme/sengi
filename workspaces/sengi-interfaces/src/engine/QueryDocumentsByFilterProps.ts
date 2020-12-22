import { DocFragment } from '../doc'
import { DocStoreOptions } from '../docStore'
import { RequestProps } from './RequestProps'

export interface QueryDocumentsByFilterProps {
  roleNames: string[]
  docTypeName: string
  fieldNames: string[]
  filterName: string
  filterParams: DocFragment
  reqProps: RequestProps
  docStoreOptions: DocStoreOptions
  limit?: number
  offset?: number
}
