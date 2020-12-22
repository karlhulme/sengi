import { SengiExpressUnsupportedRequestContentTypeError } from '../errors'
import { MimeType } from '../enums'

/**
 * Raises an error if the given content type is not JSON.
 * @param {String} contentType A MIME content type.
 */
export function ensureHeaderJsonContentType (contentType?: string|string[]): void {
  if (typeof contentType === 'undefined') {
    throw new SengiExpressUnsupportedRequestContentTypeError('undefined', MimeType.APPLICATION_JSON_CONTENT_TYPE)
  }

  const contentTypeArray = Array.isArray(contentType) ? contentType : [contentType]

  const acceptableMimeTypes: string[] = [
    MimeType.APPLICATION_JSON_CONTENT_TYPE
  ]

  const isOkay = contentTypeArray.findIndex(c => acceptableMimeTypes.includes(c)) > -1

  if (!isOkay) {
    throw new SengiExpressUnsupportedRequestContentTypeError(contentTypeArray.join(', '), MimeType.APPLICATION_JSON_CONTENT_TYPE)
  }
}
