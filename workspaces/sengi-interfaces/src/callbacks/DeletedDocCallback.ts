import { DocStoreOptions } from '../docStore'
import { DocType } from '../docType'
import { RequestProps } from '../engine'

export interface DeletedDocCallbackProps {
  roleNames: string[]
  docStoreOptions: DocStoreOptions
  docType: DocType
  reqProps: RequestProps
  id: string
}

export type DeletedDocCallback = (props: DeletedDocCallbackProps) => Promise<void>
