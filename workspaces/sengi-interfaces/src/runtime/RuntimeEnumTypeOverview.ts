/**
 * Represents an enum accessed at runtime.
 */
export interface RuntimeEnumTypeOverview {
  /**
   * The domain of the enum, used to guarantee uniqueness.
   */
  domain: string

  /**
   * The name of the system.
   */
  system: string
  
  /**
   * The name of the enum.
   */
  name: string

  /**
   * The title of the enum, suitable for display.
   */
  title: string
}