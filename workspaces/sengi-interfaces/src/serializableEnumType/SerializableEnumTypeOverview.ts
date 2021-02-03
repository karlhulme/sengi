/**
 * Represents the overview of a serializable enum type.
 */
export interface SerializableEnumTypeOverview {
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