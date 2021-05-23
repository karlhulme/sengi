import { DocPatch } from 'sengi-interfaces'
import { ensureHeaderJsonAcceptType, ensureDocTypeFromSingularOrPluralName, ensureHeaderRequestId, ensureHeaderReqVersion, ensureHeaderRoleNames } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a patch request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function patchDocumentHandler<RequestProps, DocStoreOptions, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>): Promise<void> {
  try {
    ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

    const docType = ensureDocTypeFromSingularOrPluralName(props.docTypes, props.matchedResource.urlParams['docTypeSingularOrPluralName'])
    const requestId = ensureHeaderRequestId(props.serverRequestId, props.req.headers[HttpHeaderNames.RequestId])
    const reqVersion = ensureHeaderReqVersion(props.req.headers[HttpHeaderNames.ReqVersion])
    const roleNames = ensureHeaderRoleNames(props.req.headers[HttpHeaderNames.RoleNames])

    const result = await props.sengi.patchDocument({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      id: props.matchedResource.urlParams['id'],
      patch: props.req.body as DocPatch,
      operationId: requestId,
      reqProps: props.reqProps,
      reqVersion,
      roleNames
    })

    applyResultToHttpResponse(props.res, {
      headers: {
        'sengi-document-version-matched': Boolean(reqVersion) ? 'true' : 'false',
        'sengi-document-operation-id': requestId,
        'sengi-document-operation-type': result.isUpdated ? 'update' : 'none'
      },
      statusCode: 204
    })
  } catch (err) {
    applyErrorToHttpResponse(props.req, props.res, { err })
  }
}
