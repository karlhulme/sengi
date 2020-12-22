import { DocStoreOptions } from '../docStore'
import { RequestProps } from './RequestProps'

export interface DeleteDocumentProps {
  roleNames: string[]
  docTypeName: string
  id: string
  reqProps: RequestProps
  docStoreOptions: DocStoreOptions
}
