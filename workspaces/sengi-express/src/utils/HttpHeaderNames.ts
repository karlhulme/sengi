export const HttpHeaderNames = {
  /**
   * The clients desired payload type to be included in the response.
   */
  AcceptType: 'accept',

  /**
   * The type of the payload sent by the client in the request.
   */
  ContentType: 'content-type',

  /**
   * The clients id for the request that is used to set an operation id
   * or the id of a newly created document.
   */
  RequestId: 'x-request-id',

  /**
   * The specific server version of a document that should be operated on.
   */
  ReqVersion: 'if-match',

  /**
   * The client api key.
   */
  ApiKey: 'x-api-key'
}
