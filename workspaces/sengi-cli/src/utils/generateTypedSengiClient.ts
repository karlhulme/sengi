import { SerializableDocType } from 'sengi-interfaces'

/**
 * Returns the typescript source code for a typed sengi client.
 * @param docTypes An array of serializable doc types.
 */
export function generateTypedSengiClient (docTypes: SerializableDocType[]): string {
  const fieldNameDeclarations = docTypes
    .map(docType => `type ${docType.name}FieldName = ${Object.keys(docType.fields).join('|')}`)
    .join('\n')
  
  const classDeclaration = `export class TypedSengiClient extends SengiClient {}`

  return `${fieldNameDeclarations}\n\n${classDeclaration}`
}
