import { Request } from 'express'
import { RestResourceType } from '../enums'
import {
  createDocumentHandler,
  deleteDocumentHandler,
  getDocumentHandler,
  invalidEndPointVerbHandlerFactory,
  invalidPathHandler,
  newDocumentHandler,
  operateOnDocumentHandler,
  patchDocumentHandler,
  queryDocumentsHandler,
  replaceDocumentHandler,
  RequestHandler,
  rootHandler,
  selectAllDocumentsHandler,
  selectDocumentsByFilterHandler,
  selectDocumentsByIdsHandler
} from '../handlers'
import { MatchedRestResource } from '../matching'

/**
 * Returns a request handler appropriate to the request and matched resource. 
 * @param req An express request.
 * @param matchedResource A matched resource.
 */
export function selectHandlerForRequest<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult> (req: Request, matchedResource: MatchedRestResource): RequestHandler<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult> {
  if (matchedResource.type === RestResourceType.RECORD_COLLECTION) {
    switch (req.method) {
      case 'GET': {
        if (req.query.ids) {
          return selectDocumentsByIdsHandler
        } else if (req.query.filterName) {
          return selectDocumentsByFilterHandler
        } else if (req.query.queryName) {
          return queryDocumentsHandler
        } else {
          return selectAllDocumentsHandler
        }
      }
      case 'POST': return newDocumentHandler
      default: return invalidEndPointVerbHandlerFactory(['POST', 'GET'], req.method)
    }
  } else if (matchedResource.type === RestResourceType.CONSTRUCTOR) {
    switch (req.method) {
      case 'POST': return createDocumentHandler
      default: return invalidEndPointVerbHandlerFactory(['POST'], req.method)
    }
  } else if (matchedResource.type === RestResourceType.RECORD) {
    switch (req.method) {
      case 'GET': return getDocumentHandler
      case 'DELETE': return deleteDocumentHandler
      case 'PATCH': return patchDocumentHandler
      case 'PUT': return replaceDocumentHandler
      default: return invalidEndPointVerbHandlerFactory(['DELETE', 'GET', 'PATCH', 'PUT'], req.method)
    }
  } else if (matchedResource.type === RestResourceType.OPERATION) {
    switch (req.method) {
      case 'POST': return operateOnDocumentHandler
      default: return invalidEndPointVerbHandlerFactory(['POST'], req.method)
    }
  } else if (matchedResource.type === RestResourceType.ROOT) {
    switch (req.method) {
      case 'GET': return rootHandler
      default: return invalidEndPointVerbHandlerFactory(['GET'], req.method)
    }
  } else {
    return invalidPathHandler
  }
}
