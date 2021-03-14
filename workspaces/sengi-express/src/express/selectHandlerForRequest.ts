import { Request } from 'express'
import { RestResourceType } from '../enums'
import {
  createDocumentHandler,
  deleteDocumentHandler,
  docTypesHandler,
  docTypeHandler,
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
  if (matchedResource.type === RestResourceType.RECORD_COLLECTION) {
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
  } else if (matchedResource.type === RestResourceType.RECORD) {
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
  } else if (matchedResource.type === RestResourceType.DOC_TYPES) {
    switch (req.method) {
      case 'GET': return docTypesHandler
      default: return invalidEndPointVerbHandlerFactory(['GET'], req.method)
    }
  } else if (matchedResource.type === RestResourceType.DOC_TYPE) {
    switch (req.method) {
      case 'GET': return docTypeHandler
      default: return invalidEndPointVerbHandlerFactory(['GET'], req.method)
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
