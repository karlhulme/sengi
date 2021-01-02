/**
 * Represents an item in an enumeration deduced at runtime.
 * This will follow a very similar (if not exact) structure to
 * the jsonotron-js type EnumTypeItem.  It is declared here so
 * that consumers can work with this type without having to
 * import jsonotron-js.
 */
export interface RuntimeEnumTypeItem {
  /**
   * The underlying value of the item.
   */
  value: string

  /**
   * The display text of the value in English.
   */
  text: string

  /**
   * If populated, this value explains why the value was deprecated
   * and/or which item to use instead. 
   */
  deprecated?: string

  /**
   * A symbol associated with the item.
   */
  symbol?: string

  /**
   * The documentation for the enum type item.
   */
  documentation?: string
}
