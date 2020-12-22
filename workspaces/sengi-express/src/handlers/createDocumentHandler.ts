import { DocFragment } from 'sengi-interfaces'
import { ensureHeaderJsonContentType, ensureDocTypeFromPluralName, ensureHeaderRequestId, ensureHeaderRoleNames } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a create document request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function createDocumentHandler (props: RequestHandlerProps): Promise<void> {
  try {
    ensureHeaderJsonContentType(props.req.headers[HttpHeaderNames.ContentType])

    const docType = ensureDocTypeFromPluralName(props.docTypes, props.matchedResource.urlParams['docTypePluralName'])
    const requestId = ensureHeaderRequestId(props.serverRequestId, props.req.headers[HttpHeaderNames.RequestId])
    const roleNames = ensureHeaderRoleNames(props.req.headers[HttpHeaderNames.RoleNames])

    const result = await props.sengi.createDocument({
      constructorParams: props.req.body as DocFragment,
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      id: requestId,
      reqProps: props.reqProps,
      roleNames
    })

    applyResultToHttpResponse(props.res, {
      headers: {
        location: `${props.baseUrl}/docs/${docType.pluralName}/${requestId}`,
        'sengi-document-operation-type': result.isNew ? 'create' : 'none'
      },
      statusCode: 201
    })
  } catch (err) {
    applyErrorToHttpResponse(props.res, { err })
  }
}
