import { Request, Response } from 'express'
import { Sengi } from 'sengi-engine'
import { DocType, RequestProps } from 'sengi-interfaces'
import { MatchedRestResource } from '../matching'

export interface RequestHandlerProps {
  baseUrl: string
  docStoreOptions: Record<string, unknown>
  docTypes: DocType[]
  matchedResource: MatchedRestResource
  req: Request
  reqProps: RequestProps
  res: Response
  serverRequestId: string
  sengi: Sengi
}

