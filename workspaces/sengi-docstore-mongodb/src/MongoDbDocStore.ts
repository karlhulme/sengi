/* eslint-disable @typescript-eslint/no-unused-vars */
import { FilterQuery, MongoClient, MongoClientOptions } from 'mongodb'
import { 
  Doc, DocStore, DocStoreDeleteByIdProps, DocStoreDeleteByIdResult, DocStoreDeleteByIdResultCode,
  DocStoreExistsProps, DocStoreExistsResult, DocStoreFetchProps, DocStoreFetchResult, DocStoreQueryProps,
  DocStoreQueryResult, DocStoreUpsertProps, DocStoreUpsertResult, DocStoreUpsertResultCode,
  UnexpectedDocStoreError
} from 'sengi-interfaces'
import { DocStoreCommandProps } from 'sengi-interfaces/types/docStore/DocStoreCommandProps'
import { DocStoreCommandResult } from 'sengi-interfaces/types/docStore/DocStoreCommandResult'
import { MongoDbDoc } from './MongoDbDoc'

type MongoDbDocStoreOptions = Record<string, unknown>
type MongoDbDocStoreFilter = FilterQuery<Doc>
interface MongoDbDocStoreCommand {
  count?: boolean
}
interface MongoDbDocStoreCommandResult {
  count?: number
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
export class MongoDbDocStore implements DocStore<MongoDbDocStoreOptions, MongoDbDocStoreFilter, MongoDbDocStoreCommand, MongoDbDocStoreCommandResult> {
  generateDocVersionFunc: () => string
  getDatabaseNameFunc: (docTypeName: string, docTypePluralName: string, options: MongoDbDocStoreOptions) => string
  getCollectionNameFunc: (databaseName: string, docTypeName: string, docTypePluralName: string, options: MongoDbDocStoreOptions) => string
  mongoClient: MongoClient

  /**
   * Returns a mongo projection object
   * @param {Array} fieldNames An array of field names.
   */
  private buildQueryProjection (fieldNames: string[]) {
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
  private buildQueryResult (docs: Doc[], fieldNames: string[]) {
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
   * Executes a command against the document store.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param command A command to execute.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
   async command (docTypeName: string, docTypePluralName: string, command: MongoDbDocStoreCommand, options: MongoDbDocStoreOptions, props: DocStoreCommandProps): Promise<DocStoreCommandResult<MongoDbDocStoreCommandResult>> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      if (command.count) {
        const result = await this.mongoClient.db(databaseName).collection(collectionName).estimatedDocumentCount()

        return {
          commandResult: { count: result }
        }
      } else {
        return { commandResult: {} }
      }
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error processing \'command\'.', err)
    }
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
   * Query for all documents of a specified type.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names to include in the response.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async queryAll (docTypeName: string, docTypePluralName: string, fieldNames: string[], options: MongoDbDocStoreOptions, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const docs = await this.mongoClient.db(databaseName).collection(collectionName).find({}, {
        projection: this.buildQueryProjection(fieldNames),
        limit: props.limit,
        skip: props.offset
      }).toArray()
  
      return this.buildQueryResult(docs, fieldNames)
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error processing \'queryAll\'.', err)
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
  async queryByFilter (docTypeName: string, docTypePluralName: string, fieldNames: string[], filter: MongoDbDocStoreFilter, options: MongoDbDocStoreOptions, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const docs = await this.mongoClient.db(databaseName).collection(collectionName).find(filter, {
        projection: this.buildQueryProjection(fieldNames),
        limit: props.limit,
        skip: props.offset
      }).toArray()
  
      return this.buildQueryResult(docs, fieldNames)
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error procesing \'queryByFilter\'.', err)
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
  async queryByIds (docTypeName: string, docTypePluralName: string, fieldNames: string[], ids: string[], options: MongoDbDocStoreOptions, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const docs = await this.mongoClient.db(databaseName).collection(collectionName).find({ _id: { $in: ids } }, {
        projection: this.buildQueryProjection(fieldNames),
        limit: props.limit,
        skip: props.offset
      }).toArray()
  
      return this.buildQueryResult(docs, fieldNames)
    } catch (err) {
      // istanbul ignore next
      throw new UnexpectedDocStoreError('Mongo database error procesing \'queryByIds\'.', err)
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
  async upsert (docTypeName: string, docTypePluralName: string, doc: Doc, options: MongoDbDocStoreOptions, props: DocStoreUpsertProps): Promise<DocStoreUpsertResult> {
    try {
      const databaseName = this.getDatabaseNameFunc(docTypeName, docTypePluralName, options)
      const collectionName = this.getCollectionNameFunc(databaseName, docTypeName, docTypePluralName, options)
  
      const readyDoc: MongoDbDoc = {
        ...doc,
        _id: doc.id,
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
