/**
 * Represents a doc type made available at runtime.
 */
export interface RuntimeDocTypeOverview {
  /**
   * The name of a doc type.
   */
  name: string

  /**
   * The plural name of a doc type.
   */
  pluralName: string

  /**
   * The title of a doc type, suitable for display.
   */
  title: string

  /**
   * The plural title of a doc type, suitable for display.
   */
  pluralTitle: string

  /**
   * The summary description of the doc type.
   */
  summary: string
}
