import { SengiClient } from 'sengi-client'
import { Doc } from 'sengi-interfaces'

type customerFieldName = 'name'|'age'|'dateOfBirth'|'starSign'

export class TypedSengiClient extends SengiClient {
  async getCustomerById ({ documentId, fieldNames, pathComponents, roleNames }: { documentId: string; fieldNames: customerFieldName[]; pathComponents?: string[]; roleNames?: string[] }): Promise<Doc> {
    return super.getDocumentById({ docTypePluralName: 'customers', documentId, fieldNames, pathComponents, roleNames })
  }
}

const testFunction = async function () {
  const client = new TypedSengiClient()
  const xyz = await client.getCustomerById({
    documentId: '123',
    fieldNames: ['age', 'dateOfBirth', 'name', 'starSign']
  })
  console.log(xyz)
}

testFunction()