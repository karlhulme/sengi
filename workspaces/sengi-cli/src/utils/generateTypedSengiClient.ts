import { SerializableDocType } from 'sengi-interfaces'
import { getSafeDocTypeName } from './getSafeDocTypeName'
import { capitaliseFirstLetter } from './capitaliseFirstLetter'

/**
 * Returns the typescript source code for a typed sengi client.
 * @param docTypes An array of serializable doc types.
 */
export function generateTypedSengiClient (docTypes: SerializableDocType[]): string {
  const importDeclaration = 'import { SengiClient } from \'sengi-client\''
  
  const docOpDeclaration = 'export interface DocOp {\n  opId: string\n  style: \'operation\'|\'patch\'\n  operationName?: string\n}'

  const fieldNameDeclarations = docTypes
    .map(docType => `type ${getSafeDocTypeName(docType.name)}FieldName = ${Object.keys(docType.fields).map(f => `'${f}'`).join('|')}`)
    .join('\n')
  
  const docTypeInterfaces = docTypes
    .map(docType => {
      const fieldLines = [
        '  id?: string',
        '  docType?: string',
        '  docOps?: DocOp[]',
        ...Object.keys(docType.fields)
          .map(fieldName => {
            return `  ${fieldName}?: ${docType.fields[fieldName].typeName}`
          })
      ]

      return `export interface ${capitaliseFirstLetter(docType.name)} {\n${fieldLines.join('\n')}\n}`
    })
    .join('\n')

  const classDeclaration = `export class TypedSengiClient extends SengiClient {}`

  const lineBreaks = '\n\n'

  return importDeclaration + lineBreaks +
    docOpDeclaration + lineBreaks +
    fieldNameDeclarations + lineBreaks +
    docTypeInterfaces + lineBreaks +
    classDeclaration
}
