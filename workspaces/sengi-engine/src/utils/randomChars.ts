import crypto from 'crypto'

/**
 * Returns a sequence of random hex characters.
 * @param length A length of string to produce.
 */
export function randomChars (length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}
