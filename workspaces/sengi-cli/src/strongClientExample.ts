import { SengiClient } from 'sengi-client'

type customerFieldName = 'name'|'age'|'dateOfBirth'|'starSign'|'docOps'

interface Customer {
  name?: string
  age?: number
  dateOfBirth?: string
  starSign?: string
  docOps?: { opId: string, style: 'operation'|'patch', operationName?: string }[]
}

export class TypedSengiClient extends SengiClient {
  async getCustomerById ({ documentId, fieldNames, pathComponents, roleNames }: { documentId: string; fieldNames: customerFieldName[]; pathComponents?: string[]; roleNames?: string[] }): Promise<Customer> {
    return super.getDocumentById({ docTypePluralName: 'customers', documentId, fieldNames, pathComponents, roleNames })
  }
}

const testFunction = async function () {
  const client = new TypedSengiClient()
  const xyz = await client.getCustomerById({
    documentId: '123',
    fieldNames: ['age', 'dateOfBirth', 'name', 'starSign']
  })
  console.log(xyz.age)
}

testFunction()