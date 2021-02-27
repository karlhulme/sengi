import { SerializableDocType } from 'sengi-interfaces'
import { getSafeDocTypeName } from './getSafeDocTypeName'

/**
 * Returns the typescript source code for a typed sengi client.
 * @param docTypes An array of serializable doc types.
 */
export function generateTypedSengiClient (docTypes: SerializableDocType[]): string {
  const importDeclaration = 'import { SengiClient } from \'sengi-client\''
  
  const fieldNameDeclarations = docTypes
    .map(docType => `type ${getSafeDocTypeName(docType.name)}FieldName = ${Object.keys(docType.fields).map(f => `'${f}'`).join('|')}`)
    .join('\n')
  
  const classDeclaration = `export class TypedSengiClient extends SengiClient {}`

  return `${importDeclaration}\n\n${fieldNameDeclarations}\n\n${classDeclaration}`
}
