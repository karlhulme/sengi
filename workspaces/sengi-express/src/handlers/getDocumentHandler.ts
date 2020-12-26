import { ensureHeaderJsonAcceptType, ensureDocTypeFromPluralName, ensureHeaderRoleNames, ensureQueryFieldNames } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { SengiExpressDocIdNotFound } from '../errors'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a get document request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function getDocumentHandler (props: RequestHandlerProps): Promise<void> {
  try {
    ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

    const docType = ensureDocTypeFromPluralName(props.docTypes, props.matchedResource.urlParams['docTypePluralName'])
    const fieldNames = ensureQueryFieldNames(props.req.query.fields)
    const roleNames = ensureHeaderRoleNames(props.req.headers[HttpHeaderNames.RoleNames])
    const id = props.matchedResource.urlParams['id']

    const result = await props.sengi.queryDocumentsByIds({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      fieldNames,
      ids: [id],
      reqProps: props.reqProps,
      roleNames
    })

    if (result.docs.length === 0) {
      throw new SengiExpressDocIdNotFound(id)
    }

    applyResultToHttpResponse(props.res, {
      headers: {
        'sengi-document-operation-type': 'read'
      },
      json: { doc: result.docs[0], deprecations: result.deprecations },
      statusCode: 200
    })
  } catch (err) {
    applyErrorToHttpResponse(props.req, props.res, { err })
  }
}
