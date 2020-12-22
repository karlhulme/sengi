import { RestResourceType } from '../enums'

/**
 * Represents the properties to be passed to a sengi express callback.
 */
export interface SengiExpressCallbackProps {
  headers: Record<string, string>
  matchedResourceType: RestResourceType
  method: string
  path: string
  urlParams: Record<string, string>
}
