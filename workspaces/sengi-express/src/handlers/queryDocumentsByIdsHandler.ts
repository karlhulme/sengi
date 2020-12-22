import { ensureHeaderJsonAcceptType, ensureDocTypeFromPluralName, ensureHeaderRoleNames, ensureQueryFieldNames, ensureQueryIds } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a query documents by ids request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function queryDocumentsByIdsHandler (props: RequestHandlerProps): Promise<void> {
  try {
    ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

    const docType = ensureDocTypeFromPluralName(props.docTypes, props.matchedResource.urlParams['docTypePluralName'])
    const fieldNames = ensureQueryFieldNames(props.req.query.fields)
    const roleNames = ensureHeaderRoleNames(props.req.headers[HttpHeaderNames.RoleNames])
    const ids = ensureQueryIds(props.req.query.ids)

    const result = await props.sengi.queryDocumentsByIds({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      fieldNames,
      ids,
      reqProps: props.reqProps,
      roleNames
    })

    applyResultToHttpResponse(props.res, {
      headers: {
        'sengi-document-operation-type': 'read'
      },
      json: { docs: result.docs, deprecations: result.deprecations },
      statusCode: 200
    })
  } catch (err) {
    applyErrorToHttpResponse(props.res, { err })
  }
}
