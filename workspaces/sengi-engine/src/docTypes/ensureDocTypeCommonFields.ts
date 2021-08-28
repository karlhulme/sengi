import { AnyDocType } from 'sengi-interfaces'

/**
 * Adds id, docType, docOpIds and docVersion fields to the json schema
 * if they are not already defined.
 * @param docType A doc type.
 */
export function ensureDocTypeCommonFields (docType: AnyDocType): void {
  if (typeof docType.jsonSchema === 'object' && docType.jsonSchema.type === 'object' && typeof docType.jsonSchema.properties === 'object') {
    const propertyBlock = docType.jsonSchema.properties as Record<string, unknown>

    if (!propertyBlock.id) {
      propertyBlock.id = {
        type: 'string',
        maxLength: 50
      }
    }

    if (!propertyBlock.docType) {
      propertyBlock.docType = {
        enum: [docType.name]
      }
    }

    if (!propertyBlock.docOpIds) {
      propertyBlock.docOpIds = {
        type: 'array',
        items: {
          type: 'string',
          maxLength: 50
        }
      }
    }

    if (!propertyBlock.docVersion) {
      propertyBlock.docVersion = {
        type: 'string',
        maxLength: 50
      }
    }

    if (!propertyBlock.docCreatedMillisecondsSinceEpoch) {
      propertyBlock.docCreatedMillisecondsSinceEpoch = {
        type: 'number'
      }
    }

    if (!propertyBlock.docCreatedByUserId) {
      propertyBlock.docCreatedByUserId = {
        type: 'string',
        maxLength: 50
      }
    }

    if (!propertyBlock.docLastUpdatedMillisecondsSinceEpoch) {
      propertyBlock.docLastUpdatedMillisecondsSinceEpoch = {
        type: 'number'
      }
    }

    if (!propertyBlock.docLastUpdatedByUserId) {
      propertyBlock.docLastUpdatedByUserId = {
        type: 'string',
        maxLength: 50
      }
    }

    if (!docType.jsonSchema.required) {
      docType.jsonSchema.required = []
    }

    const requiredBlock = docType.jsonSchema.required as string[]

    if (!requiredBlock.includes('id')) {
      requiredBlock.push('id')
    }

    if (!requiredBlock.includes('docType')) {
      requiredBlock.push('docType')
    }

    if (!requiredBlock.includes('docOpIds')) {
      requiredBlock.push('docOpIds')
    }

    if (!requiredBlock.includes('docCreatedByUserId')) {
      requiredBlock.push('docCreatedByUserId')
    }

    if (!requiredBlock.includes('docCreatedMillisecondsSinceEpoch')) {
      requiredBlock.push('docCreatedMillisecondsSinceEpoch')
    }

    if (!requiredBlock.includes('docLastUpdatedByUserId')) {
      requiredBlock.push('docLastUpdatedByUserId')
    }

    if (!requiredBlock.includes('docLastUpdatedMillisecondsSinceEpoch')) {
      requiredBlock.push('docLastUpdatedMillisecondsSinceEpoch')
    }
  }
}
