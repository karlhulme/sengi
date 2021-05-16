/* eslint-disable @typescript-eslint/no-unused-vars */
import { FilterQuery, MongoClient, MongoClientOptions } from 'mongodb'
import { 
  DocRecord,
  DocStore, DocStoreDeleteByIdProps, DocStoreDeleteByIdResult, DocStoreDeleteByIdResultCode, DocStoredField,
  DocStoreExistsProps, DocStoreExistsResult, DocStoreFetchProps, DocStoreFetchResult, DocStoreQueryProps,
  DocStoreQueryResult, DocStoreSelectProps, DocStoreSelectResult, DocStoreUpsertProps, DocStoreUpsertResult, DocStoreUpsertResultCode,
  UnexpectedDocStoreError
} from 'sengi-interfaces'

/**
 * Represents the options that can be passed to a mongodb document store.
 */
export type MongoDbDocStoreOptions = Record<string, unknown>

/**
 * Represents a filter that can be applied to a collection of documents.
 */
export type MongoDbDocStoreFilter = FilterQuery<DocRecord>

/**
 * Represents a command that can be applied to a collection of documents.
 */
export interface MongoDbDocStoreQuery {
  /**
   * If true, determine the approximate number of documents in a collection.
   */
  estimatedCount?: boolean
}

/**
 * Represents the result of a command executed against a collection of documents.
 */
export interface MongoDbDocStoreQueryResult {
  /**
   * If populated, contains the approximate number of documents in a collection.
   */
  estimatedCount?: number
}

/**
 * Represents a document stored in the Mongo database.
 */
 export type MongoDbDoc = Record<string, DocStoredField> & {
  /**
   * The id of the document.
   */
  _id: string,

  /**
   * The version of the document.
   */
  docVersion: string,
}

/**
 * Encapsulates the construction parameters of the MongoDbDocStore.
 */
interface MongoDbDocStoreConstructorProps {
  /**
   * The url of a mongo instance, e.g. mongodb://localhost:27017
   */
  mongoUrl: string

  /**
   * The mongo client options, typically { auth: { user: '', password: '' }, ignoreUndefined: true, useUnifiedTopology: true }.
   */
  mongoOptions: MongoClientOptions

  /**
   * A function that generates a unique string.
   */
  generateDocVersionFunc: () => string

  /**
   * A function that names the database that contains the documents identified by the docTypeName or docTypePluralName.
   */
  getDatabaseNameFunc: (docTypeName: string, docTypePluralName: string, options: MongoDbDocStoreOptions) => string

  /**
   * A function that names the collection that contains the documents identified by the docTypeName or docTypePluralName.
   */
  getCollectionNameFunc: (databaseName: string, docTypeName: string, docTypePluralName: string, options: MongoDbDocStoreOptions) => string
}

/**
 * An document store based on MongoDB.
 */
export class MongoDbDocStore implements DocStore<MongoDbDocStoreOptions, MongoDbDocStoreFilter, MongoDbDocStoreQuery, MongoDbDocStoreQueryResult> {
  generateDocVersionFunc: () => string
  getDatabaseNameFunc: (docTypeName: string, docTypePluralName: string, options: MongoDbDocStoreOptions) => string
  getCollectionNameFunc: (databaseName: string, docTypeName: string, docTypePluralName: string, options: MongoDbDocStoreOptions) => string
  mongoClient: MongoClient

  /**
   * Returns a mongo projection object
   * @param {Array} fieldNames An array of field names.
   */
  private buildSelectProjection (fieldNames: string[]) {
    return fieldNames.reduce((agg: Record<string, number>, fname: string) => {
      agg[fname] = 1
      return agg
    }, { _id: fieldNames.includes('id') ? 1 : 0 })
  }

  /**
   * Patches the id field and returns a result object
   * with a docs property.
   * @param {Array} docs An array of docs.
   * @param {Array} fieldNames An array of field names.
   */
  private buildSelectResult (docs: DocRecord[], fieldNames: string[]) {
    if (fieldNames.includes('id')) {
      docs.forEach(doc => {
        doc.id = doc._id as string
        delete doc._id
      })
    }

    return { docs }
  }

  /**
   * Constructs a new instance of the MongoDB document store.
   * @param props The constructor properties.
   */
  constructor (props: MongoDbDocStoreConstructorProps) {
    this.generateDocVersionFunc = props.generateDocVersionFunc
    this.getDatabaseNameFunc = props.getDatabaseNameFunc
    this.getCollectionNameFunc = props.getCollectionNameFunc
    this.mongoClient = new MongoClient(props.mongoUrl, props.mongoOptions)
  }

  /**
   * Connects to the mongo database.
   */
  async connect (): Promise<void> {
    await this.mongoClient.connect()
  }

  /**
   * Disconnects from the mongo database.
   */
  async close (): Promise<void> {
    await this.mongoClient.close()
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
  async deleteById (docTypeName: string, docTypePluralName: string, id: string, options: MongoDbDocStoreOptions, props: DocStoreDeleteByIdProps): Promise<DocStoreDeleteByIdResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const result = await this.mongoClient.db(databaseName).collection(collectionName).deleteOne({ _id: id })
  
      return result.deletedCount === 1
        ? { code: DocStoreDeleteByIdResultCode.DELETED }
        : { code: DocStoreDeleteByIdResultCode.NOT_FOUND }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error processing \'deleteById\'.', err)
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
  async exists (docTypeName: string, docTypePluralName: string, id: string, options: MongoDbDocStoreOptions, props: DocStoreExistsProps): Promise<DocStoreExistsResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const result = await this.mongoClient.db(databaseName).collection(collectionName).find({ _id: id }).limit(1).count()
  
      return { found: result === 1 }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error processing \'exists\'.', err)
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
  async fetch (docTypeName: string, docTypePluralName: string, id: string, options: MongoDbDocStoreOptions, props: DocStoreFetchProps): Promise<DocStoreFetchResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const result = await this.mongoClient.db(databaseName).collection(collectionName).findOne({ _id: id })

      if (result && result.docType === docTypeName) {
        result.id = result._id
        delete result._id
        return { doc: result }
      } else {
        return { doc: null }
      }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error processing \'fetch\'.', err)
    }
  }

  /**
   * Executes a query against the document store.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param query A query to execute.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
   async query (docTypeName: string, docTypePluralName: string, query: MongoDbDocStoreQuery, options: MongoDbDocStoreOptions, props: DocStoreQueryProps): Promise<DocStoreQueryResult<MongoDbDocStoreQueryResult>> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      if (query.estimatedCount) {
        const result = await this.mongoClient.db(databaseName).collection(collectionName).estimatedDocumentCount()

        return {
          queryResult: { estimatedCount: result }
        }
      } else {
        return { queryResult: {} }
      }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error processing \'query\'.', err)
    }
  }

  /**
   * Select all documents of a specified type.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names to include in the response.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async selectAll (docTypeName: string, docTypePluralName: string, fieldNames: string[], options: MongoDbDocStoreOptions, props: DocStoreSelectProps): Promise<DocStoreSelectResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const docs = await this.mongoClient.db(databaseName).collection(collectionName).find({}, {
        projection: this.buildSelectProjection(fieldNames),
        limit: props.limit,
        skip: props.offset
      }).toArray()
  
      return this.buildSelectResult(docs, fieldNames)
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error processing \'selectAll\'.', err)
    }
  }

  /**
   * Select documents of a specified type that also match a filter.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names to include in the response.
   * @param filterExpression A filter expression that resulted from invoking the filter.
   * implementation on the doc type.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async selectByFilter (docTypeName: string, docTypePluralName: string, fieldNames: string[], filter: MongoDbDocStoreFilter, options: MongoDbDocStoreOptions, props: DocStoreSelectProps): Promise<DocStoreSelectResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const docs = await this.mongoClient.db(databaseName).collection(collectionName).find(filter, {
        projection: this.buildSelectProjection(fieldNames),
        limit: props.limit,
        skip: props.offset
      }).toArray()
  
      return this.buildSelectResult(docs, fieldNames)
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error procesing \'selectByFilter\'.', err)
    }
  }

  /**
   * Select documents of a specified type that also have one of the given ids.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names to include in the response.
   * @param ids An array of document ids.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async selectByIds (docTypeName: string, docTypePluralName: string, fieldNames: string[], ids: string[], options: MongoDbDocStoreOptions, props: DocStoreSelectProps): Promise<DocStoreSelectResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const docs = await this.mongoClient.db(databaseName).collection(collectionName).find({ _id: { $in: ids } }, {
        projection: this.buildSelectProjection(fieldNames),
        limit: props.limit,
        skip: props.offset
      }).toArray()
  
      return this.buildSelectResult(docs, fieldNames)
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error procesing \'selectByIds\'.', err)
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
  async upsert (docTypeName: string, docTypePluralName: string, doc: DocRecord, options: MongoDbDocStoreOptions, props: DocStoreUpsertProps): Promise<DocStoreUpsertResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const readyDoc: MongoDbDoc = {
        ...doc,
        _id: doc.id as string,
        docVersion: this.generateDocVersionFunc()
      }
  
      const result = await this.mongoClient.db(databaseName).collection(collectionName).replaceOne({
        // filter to identify document to update
        _id: doc.id as string,
        docVersion: props.reqVersion
      },
      readyDoc,
      {
        // generally upsert if the doc is missing, but not if we were looking for a required version
        upsert: !props.reqVersion
      })
  
      if (result.upsertedCount === 1) {
        return { code: DocStoreUpsertResultCode.CREATED }
      } else if (result.modifiedCount === 1) {
        return { code: DocStoreUpsertResultCode.REPLACED }
      } else {
        return { code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE }
      }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error procesing \'upsert\'.', err)
    }
  }
}
