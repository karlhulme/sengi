import { Doc } from '../doc'
import { DocStoreOptions } from '../docStore'
import { DocType } from '../docType'
import { RequestProps } from '../engine'

export interface SavedDocCallbackProps {
  roleNames: string[]
  docStoreOptions: DocStoreOptions
  docType: DocType
  reqProps: RequestProps
  doc: Doc
  isNew: boolean|null
}

export type SavedDocCallback = (props: SavedDocCallbackProps) => Promise<void>
