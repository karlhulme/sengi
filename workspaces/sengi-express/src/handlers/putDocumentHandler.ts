import { Doc } from 'sengi-interfaces'
import { ensureHeaderJsonContentType, ensureDocTypeFromPluralName, ensureHeaderRoleNames, ensureDocIdConsistency } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a put document request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function putDocumentHandler (props: RequestHandlerProps): Promise<void> {
  try {
    ensureHeaderJsonContentType(props.req.headers[HttpHeaderNames.ContentType])
    ensureDocIdConsistency(props.req.body.id, props.matchedResource.urlParams['id'])

    const docType = ensureDocTypeFromPluralName(props.docTypes, props.matchedResource.urlParams['docTypePluralName'])
    const roleNames = ensureHeaderRoleNames(props.req.headers[HttpHeaderNames.RoleNames])

    const result = await props.sengi.replaceDocument({
      doc: props.req.body as Doc,
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      reqProps: props.reqProps,
      roleNames
    })

    applyResultToHttpResponse(props.res, {
      headers: {
        location: `${props.baseUrl}/docs/${docType.pluralName}/${props.req.body.id}`,
        'sengi-document-operation-type': result.isNew ? 'create' : 'update'
      },
      statusCode: 204
    })
  } catch (err) {
    applyErrorToHttpResponse(props.res, { err })
  }
}
