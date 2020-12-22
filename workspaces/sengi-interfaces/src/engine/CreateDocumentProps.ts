import { DocFragment } from '../doc'
import { DocStoreOptions } from '../docStore'
import { RequestProps } from './RequestProps'

export interface CreateDocumentProps {
  roleNames: string[]
  docTypeName: string
  id: string
  constructorParams: DocFragment
  reqProps: RequestProps
  docStoreOptions: DocStoreOptions
}
