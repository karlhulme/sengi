import { DocStoreOptions } from '../docStore'
import { DocType } from '../docType'
import { RequestProps } from '../engine'

export interface PreQueryDocsCallbackProps {
  roleNames: string[]
  docStoreOptions: DocStoreOptions
  docType: DocType
  reqProps: RequestProps
  fieldNames: string[]
  retrievalFieldNames: string[]
}

export type PreQueryDocsCallback = (props: PreQueryDocsCallbackProps) => Promise<void>
