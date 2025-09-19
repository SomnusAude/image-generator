import { _ImageFormatter } from './image.formatter'
import { _ImageHelper } from './image.helper'

export namespace _ImageEntity {
    export import Helper = _ImageHelper
    export import Formatter = _ImageFormatter

    export type BaseType = {
        id: string
        prompt: string
        style: string
        uuid: string
        status: 'created' | 'pending' | 'done' | 'error'
        originalId: string | null
        thumbnailId: string | null
        createdAt: Date
        updatedAt: Date
    }
}
