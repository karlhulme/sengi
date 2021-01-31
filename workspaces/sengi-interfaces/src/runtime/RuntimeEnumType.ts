/**
 * Represents an enum accessed at runtime.
 */
export interface RuntimeEnumType {
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

  /**
   * The documentation of the enum.
   */
  documentation: string
}