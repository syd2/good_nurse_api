import {
    Model as MongooseModel,
    Document,
    FilterQuery,
    ProjectionType,
    HydratedDocument,
    PopulateOptions,
    QueryOptions,
} from "mongoose"

// Define the interface for the mongoose model
export interface IModel extends Document {
    created_at: Date
    updated_at: Date
}

// Define the interface for the CRUD operations
export interface ICrudService<T extends IModel> {
    getAll(): Promise<T[]>
    getById(id: string): Promise<T | null>
    create(data: T): Promise<T>
    update(id: string, data: T): Promise<T | null>
    delete(id: string): Promise<boolean>
}

// Define the generic CRUD service
export class CrudService<T extends IModel> implements ICrudService<T> {
    constructor(private readonly model: MongooseModel<T>) {}

    async getAll(): Promise<T[]> {
        const documents = await this.model.find()
        return documents
    }

    async getById(id: string): Promise<T | null> {
        const document = await this.model.findById(id)
        return document
    }

    async create(data: Partial<T>): Promise<T> {
        const document = await this.model.create(data)
        return document
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        // eslint-disable-next-line no-param-reassign
        data.updated_at = new Date()
        const document = await this.model.findByIdAndUpdate(id, data, { new: true })
        return document
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.deleteOne({ _id: id })
        return result.deletedCount === 1
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getOneWith(id: string, relations?: any) {
        const document = await this.model.findById(id).populate(relations)
        return document
    }

    async getManyWith(
        filter?: FilterQuery<T>,
        projection?: ProjectionType<T> | null,
        relations?: Array<{ path: string; select: Array<string> | null }>
    ): Promise<T[]> {
        const documents = await this.model.find(filter, projection).populate(relations)
        return documents
    }

    async where(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T> | null,
        options?: QueryOptions<T> | null,
        relations?: Array<{ path: string; select: Array<string> | null }> | null
    ): Promise<T[]> {
        const documents = await this.model.find(filter, projection, options)
        return documents
    }

    // async query(options: PopulateOptions | (PopulateOptions | string)[]) {
    //   const document = await this.model.find()
    //     .populate(options);
    // }
}
