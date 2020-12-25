/* eslint-disable @typescript-eslint/no-unused-vars */
import AWS from 'aws-sdk'
import { 
  Doc, DocStore, DocStoreDeleteByIdProps, DocStoreDeleteByIdResult, DocStoreDeleteByIdResultCode,
  DocStoreExistsProps, DocStoreExistsResult, DocStoreFetchProps, DocStoreFetchResult, DocStoreOptions, DocStoreQueryProps,
  DocStoreQueryResult, DocStoreUpsertProps, DocStoreUpsertResult, DocStoreUpsertResultCode,
  UnexpectedDocStoreError
} from 'sengi-interfaces'

/**
 * Encapsulates the parameters for constructing a new DynamoDbDocStore instance.
 */
interface DynamoDbDocStoreConstructorProps {
  /**
   * The url of the dynamodb instance, use 'production' for the live production instance.
   */
  dynamoUrl: string

  /**
   * The name of the AWS region.  This is only applicable if specifying 'production' as the dynamoUrl.
   */
  region: string

  /**
   * A function that returns a unique string.
   */
  generateDocVersionFunc: () => string

  /**
   * A function that names the table that contains the documents identified by the docTypeName or docTypePluralName.
   */
  getTableNameFunc: (docTypeName: string, docTypePluralName: string, options: DocStoreOptions) => string
}

/**
 * Represents a filter that can be processed by AWS DynamoDb. 
 */
export interface DynamoDbFilterExpression {
  /**
   * The name of the index to filter against.
   */
  indexName: string

  /**
   * A condition string that identifies the partition key and the
   * sort order, e.g. docType = :docType and heightInCms > :heightParam.
   */
  condition: string

  /**
   * A map of values to be assigned to the variables in the condition
   * string, e.g. { ':docType': 'tree', ':heightParam': 200 }.
  } 
   */
  conditionParams: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap
}

/**
 * A document store based on AWS DynamoDB.
 */
export class DynamoDbDocStore implements DocStore {
  generateDocVersionFunc: () => string
  getTableNameFunc: (docTypeName: string, docTypePluralName: string, options: DocStoreOptions) => string
  dynamoClient: AWS.DynamoDB.DocumentClient

  /**
   * Return a copy of the given inputDocs but with only the
   * requested fieldNames attached.
   * @param {Array} inputDocs An array of docs received from Dynamo DB.
   * @param {Array} fieldNames An array of field names.
   */
  private createOutputDocs (inputDocs: Doc[], fieldNames: string[]) {
    const outputDocs = []

    for (let i = 0; i < inputDocs.length; i++) {
      const inputDoc = inputDocs[i]
      const outputDoc: Doc = {}

      for (const fieldName of fieldNames) {
        outputDoc[fieldName] = inputDoc[fieldName]
      }

      outputDocs.push(outputDoc)
    }

    return outputDocs
  }

  /**
   * Constructs a new instance of the DynamoDb document store.
   * @param props The constructor properties.
   */
  constructor (props: DynamoDbDocStoreConstructorProps) {
    this.generateDocVersionFunc = props.generateDocVersionFunc
    this.getTableNameFunc = props.getTableNameFunc

    // istanbul ignore next - we'll never test hitting production
    this.dynamoClient = new AWS.DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
      // AWS uses undefined to mean 'production', which clashes with 'i forgot to set anything.
      // Therefore this function requires dynamoUrl to be set to production, otherwise it will
      // substitute missing values for 'http://localhost/not_specified'
      endpoint: props.dynamoUrl === 'production' ? undefined : (props.dynamoUrl || 'http://localhost/not_specified'),
      region: props.region
    })
  }

  /**
   * Delete a single document from the store using it's id.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param id The id of a document.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async deleteById (docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions, props: DocStoreDeleteByIdProps): Promise<DocStoreDeleteByIdResult> {
    try {
      const tableName = this.getTableNameFunc(docTypeName, docTypePluralName, options)

      const result = await this.dynamoClient.delete({ TableName: tableName, Key: { id }, ReturnValues: 'ALL_OLD' }).promise()
      
      const wasObjectDeleted = result.Attributes && Object.keys(result.Attributes).length > 0

      return {
        code: wasObjectDeleted
          ? DocStoreDeleteByIdResultCode.DELETED
          : DocStoreDeleteByIdResultCode.NOT_FOUND
      }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Dynamo database error processing \'deleteById\'.', err)
    }
  }

  /**
   * Determines if a document with the given id is in the datastore.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param id The id of a document.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async exists (docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions, props: DocStoreExistsProps): Promise<DocStoreExistsResult> {
    try {
      const tableName = this.getTableNameFunc(docTypeName, docTypePluralName, options)
      const result = await this.dynamoClient.get({ TableName: tableName, Key: { id }, AttributesToGet: ['id'] }).promise()
  
      return { found: Boolean(result.Item && result.Item.id) }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Dynamo database error processing \'exists\'.', err)
    }
  }

  /**
   * Fetch a single document using it's id.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param id The id of a document.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async fetch (docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions, props: DocStoreFetchProps): Promise<DocStoreFetchResult> {
    try {
      const tableName = this.getTableNameFunc(docTypeName, docTypePluralName, options)
      const result = await this.dynamoClient.get({ TableName: tableName, Key: { id } }).promise()
  
      const doc = result.Item && result.Item.docType === docTypeName
        ? { ...result.Item }
        : null
  
      return { doc }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Dynamo database error processing \'fetch\'.', err)
    }
  }

  /**
   * Query for all documents of a specified type.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names to include in the response.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async queryAll (docTypeName: string, docTypePluralName: string, fieldNames: string[], options: DocStoreOptions, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    try {
      const tableName = this.getTableNameFunc(docTypeName, docTypePluralName, options)

      const result = await this.dynamoClient.scan({
        TableName: tableName,
        AttributesToGet: fieldNames,
        ScanFilter: {
          docType: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [docTypeName]
          }
        },
        Limit: props.limit
      }).promise()
  
      // istanbul ignore next - items will always be an array
      return { docs: result.Items || [] }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Dynamo database error processing \'queryAll\'.', err)
    }
  }

  /**
   * Query for documents of a specified type that also match a filter.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names to include in the response.
   * @param filterExpression A filter expression that resulted from invoking the filter.
   * implementation on the doc type.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async queryByFilter (docTypeName: string, docTypePluralName: string, fieldNames: string[], filterExpression: unknown, options: DocStoreOptions, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    try {
      const dynamoFilterExpression = filterExpression as DynamoDbFilterExpression
      const tableName = this.getTableNameFunc(docTypeName, docTypePluralName, options)
      const result = await this.dynamoClient.query({
        TableName: tableName,
        IndexName: dynamoFilterExpression.indexName,
        KeyConditionExpression: dynamoFilterExpression.condition,
        ExpressionAttributeValues: dynamoFilterExpression.conditionParams,
        Limit: props.limit
      }).promise()
  
      // istanbul ignore next - items will always be an array
      return { docs: this.createOutputDocs(result.Items || [], fieldNames) }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Dynamo database error procesing \'queryByFilter\'.', err)
    }
  }

  /**
   * Query for documents of a specified type that also have one of the given ids.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names to include in the response.
   * @param ids An array of document ids.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async queryByIds (docTypeName: string, docTypePluralName: string, fieldNames: string[], ids: string[], options: DocStoreOptions, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    try {
      const tableName = this.getTableNameFunc(docTypeName, docTypePluralName, options)
      const result = await this.dynamoClient.batchGet({
        RequestItems: {
          [tableName]: {
            // de-duplicate ids array using a set
            Keys: Array.from(new Set(ids)).map(id => ({ id })),
            AttributesToGet: fieldNames
          }
        }
      }).promise()
  
      // istanbul ignore next - responses will always be an array
      return { docs: (result.Responses || {})[tableName] }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Dynamo database error procesing \'queryByIds\'.', err)
    }
  }

  /**
   * Store a single document in the store, overwriting an existing if necessary.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param doc The document to store.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async upsert (docTypeName: string, docTypePluralName: string, doc: Doc, options: DocStoreOptions, props: DocStoreUpsertProps): Promise<DocStoreUpsertResult> {
    try {
      const tableName = this.getTableNameFunc(docTypeName, docTypePluralName, options)
      const readyDoc = {
        ...doc,
        docVersion: this.generateDocVersionFunc()
      }
  
      const isSpecificDocVersionRequired = props && props.reqVersion
  
      const result = await this.dynamoClient.put({
        TableName: tableName,
        Item: readyDoc,
        ConditionExpression: isSpecificDocVersionRequired
          ? 'docVersion = :reqVersion'
          : undefined,
        ExpressionAttributeValues: isSpecificDocVersionRequired
          ? {
            ':reqVersion': props.reqVersion
          }
          : undefined,
        ReturnValues: 'ALL_OLD'
      }).promise()
  
      const wasObjectReplaced = result.Attributes && Object.keys(result.Attributes).length > 0
  
      return {
        code: wasObjectReplaced
          ? DocStoreUpsertResultCode.REPLACED
          : DocStoreUpsertResultCode.CREATED
      }
    } catch (err) {
      // istanbul ignore next - cannot produce the else branch
      if (err.code === 'ConditionalCheckFailedException') {
        return { code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE }
      } else {
        throw new UnexpectedDocStoreError('Dynamo database error procesing \'upsert\'.', err)
      }
    }
  }
}
