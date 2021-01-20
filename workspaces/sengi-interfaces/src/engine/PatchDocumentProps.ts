import { DocPatch } from '../doc'
import { DocStoreOptions } from '../docStore'
import { RequestProps } from './RequestProps'

export interface PatchDocumentProps {
  roleNames: string[]
  docTypeName: string
  id: string
  operationId: string
  patch: DocPatch
  reqProps: RequestProps
  docStoreOptions: DocStoreOptions
  reqVersion?: string
}
