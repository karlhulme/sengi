import { DocFragment } from '../doc'
import { DocStoreOptions } from '../docStore'
import { RequestProps } from './RequestProps'

export interface OperateOnDocumentProps {
  roleNames: string[]
  docTypeName: string
  id: string
  operationId: string
  operationName: string
  operationParams: DocFragment
  reqProps: RequestProps
  docStoreOptions: DocStoreOptions
  reqVersion?: string
}
