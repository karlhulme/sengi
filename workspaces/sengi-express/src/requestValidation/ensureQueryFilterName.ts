/**
 * Returns the filter name string or an empty string
 * if it cannot be converted.
 * @param filterName A filter name string.
 */
export function ensureQueryFilterName (filterName?: unknown): string {
  if (typeof filterName === 'string') {
    return filterName.trim()
  } else {
    return ''
  }
}
