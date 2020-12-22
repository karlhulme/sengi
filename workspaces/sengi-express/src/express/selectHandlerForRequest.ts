import { Request } from 'express'
import { RestResourceType } from '../enums'
import {
  createDocumentHandler,
  deleteDocumentHandler,
  getDocumentHandler,
  invalidEndPointVerbHandlerFactory,
  invalidPathHandler,
  operateOnDocumentHandler,
  patchDocumentHandler,
  putDocumentHandler,
  queryAllDocumentsHandler,
  queryDocumentsByFilterHandler,
  queryDocumentsByIdsHandler,
  RequestHandler,
  rootHandler
} from '../handlers'
import { MatchedRestResource } from '../matching'

/**
 * Returns a request handler appropriate to the request and matched resource. 
 * @param req An express request.
 * @param matchedResource A matched resource.
 */
export function selectHandlerForRequest (req: Request, matchedResource: MatchedRestResource): RequestHandler {
  if (matchedResource.type === RestResourceType.COLLECTION) {
    switch (req.method) {
      case 'GET': {
        if (req.query.ids) {
          return queryDocumentsByIdsHandler
        } else if (req.query.filterName) {
          return queryDocumentsByFilterHandler
        } else {
          return queryAllDocumentsHandler
        }
      }
      case 'POST': return createDocumentHandler
      default: return invalidEndPointVerbHandlerFactory(['POST', 'GET'], req.method)
    }
  } else if (matchedResource.type === RestResourceType.DOCUMENT) {
    switch (req.method) {
      case 'GET': return getDocumentHandler
      case 'DELETE': return deleteDocumentHandler
      case 'PATCH': return patchDocumentHandler
      case 'PUT': return putDocumentHandler
      default: return invalidEndPointVerbHandlerFactory(['DELETE', 'GET', 'PATCH', 'PUT'], req.method)
    }
  } else if (matchedResource.type === RestResourceType.OPERATION) {
    switch (req.method) {
      case 'POST': return operateOnDocumentHandler
      default: return invalidEndPointVerbHandlerFactory(['POST'], req.method)
    }
  } else if (matchedResource.type === RestResourceType.GLOBAL_ROOT) {
    switch (req.method) {
      case 'GET': return rootHandler
      default: return invalidEndPointVerbHandlerFactory(['GET'], req.method)
    }
  } else {
    return invalidPathHandler
  }
}