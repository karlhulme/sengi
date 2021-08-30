import { ClientDocPermissionSet } from 'sengi-interfaces'

/**
 * Represents a client that has been authenticated.
 */
export interface AuthenticatedClient {
  /**
   * The name of the client.
   */
  name: string

  /**
   * The permissions assigned to the client.
   */
  docPermissions: boolean | Record<string, boolean | ClientDocPermissionSet>  
}
