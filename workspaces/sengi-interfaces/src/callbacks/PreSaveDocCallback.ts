import { Doc } from '../doc'
import { DocType } from '../docType'
import { DocStoreOptions } from '../docStore'
import { RequestProps } from '../engine'

export interface PreSaveDocCallbackProps {
  roleNames: string[]
  docStoreOptions: DocStoreOptions
  docType: DocType
  reqProps: RequestProps
  doc: Doc
  isNew: boolean|null
}

export type PreSaveDocCallback = (props: PreSaveDocCallbackProps) => Promise<void>





