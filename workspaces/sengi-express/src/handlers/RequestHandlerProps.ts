import { Request, Response } from 'express'
import { Sengi } from 'sengi-engine'
import { AnyDocType } from 'sengi-interfaces'
import { MatchedRestResource } from '../matching'

export interface RequestHandlerProps<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult> {
  baseUrl: string
  docStoreOptions: DocStoreOptions
  docTypes: AnyDocType[]
  matchedResource: MatchedRestResource
  req: Request
  reqProps: RequestProps
  res: Response
  serverRequestId: string
  sengi: Sengi<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult>
}
