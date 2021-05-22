import { Request, RequestHandler, Response } from 'express'
import { v4 } from 'uuid'
import { Sengi, SengiConstructorProps } from 'sengi-engine'
import { createRestResourceMatcherArray } from '../matching/createRestResourceMatcherArray'
import { matchPathToRestResource } from '../matching/matchPathToRestResource'
import { selectHandlerForRequest } from './selectHandlerForRequest'
import { RequestHandlerProps } from '../handlers'
import { SengiExpressCallbackProps } from './SengiExpressCallbackProps'

/**
 * Represents the properties of a sengi express constructor.
 */
export interface SengiExpressConstructorProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult> extends SengiConstructorProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult> {
  additionalComponentsCount?: number
  getDocStoreOptions?: (props: SengiExpressCallbackProps) => DocStoreOptions
  getRequestProps?: (props: SengiExpressCallbackProps) => RequestProps
  newUuid?: () => string
}

/**
 * Creates a new sengi handler that can be used as an Express route handler.
 * @param props The constructor properties.
 */
export function createSengiExpress<RequestProps, DocStoreOptions, Filter, Query, QueryResult> (props: SengiExpressConstructorProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>): RequestHandler {
  const sengi = new Sengi(props)
  const matchers = createRestResourceMatcherArray(props.additionalComponentsCount || 0)

  const getDocStoreOptions = props.getDocStoreOptions || (() => ({}) as unknown as DocStoreOptions)
  const getRequestProps = props.getRequestProps || (() => ({}) as unknown as RequestProps)
  const uuid = props.newUuid || v4

  return async (req: Request, res: Response): Promise<void> => {
    const matchedResource = matchPathToRestResource(req.path, matchers)

    const handler = selectHandlerForRequest(req, matchedResource)

    const callbackProps: SengiExpressCallbackProps = {
      headers: req.headers as Record<string, string>,
      path: req.path,
      matchedResourceType: matchedResource.type,
      method: req.method,
      urlParams: matchedResource.urlParams
    }

    const handlerParams: RequestHandlerProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult> = {
      baseUrl: req.baseUrl,
      matchedResource,
      docStoreOptions: getDocStoreOptions(callbackProps),
      docTypes: props.docTypes || [],
      req,
      reqProps: getRequestProps(callbackProps),
      res,
      sengi,
      serverRequestId: uuid()
    }

    return handler(handlerParams)
  }
}
