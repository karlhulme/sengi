import { Doc } from '../doc'
import { DocStoreOptions } from '../docStore'
import { RequestProps } from './RequestProps'

export interface ReplaceDocumentProps {
  roleNames: string[]
  docTypeName: string
  doc: Doc
  reqProps: RequestProps
  docStoreOptions: DocStoreOptions
}
