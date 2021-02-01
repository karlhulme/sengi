import { RuntimeEnumTypeItem } from './RuntimeEnumTypeItem';

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

  /**
   * An array of the items that make up the enum type.
   */
  items: RuntimeEnumTypeItem[]
}
