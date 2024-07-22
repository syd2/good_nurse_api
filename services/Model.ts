import mongoose, { Model as MongooseModel, PopulateOptions, Schema } from "mongoose"

export abstract class Model {
    public id!: string

    public created_at!: Date

    public updated_at!: Date

    public async save(): Promise<Model> {
        if (this.id) {
            this.updated_at = new Date()
            return this.update()
        }
        this.created_at = new Date()
        return this.create()
    }

    public async create(): Promise<Model> {
        const model = await (this.constructor as typeof Model).mongooseModel.create(this)
        this.id = model._id
        return this
    }

    public async update(): Promise<Model> {
        this.updated_at = new Date()
        await (this.constructor as typeof Model).mongooseModel.updateOne({ _id: this.id }, this)
        return this
    }

    public async delete(): Promise<boolean> {
        await (this.constructor as typeof Model).mongooseModel.deleteOne({
            _id: this.id,
        })
        return true
    }

    public async getRelated(
        relation: string,
        options: PopulateOptions | Array<PopulateOptions> | string
    ): Promise<Model | Model[]> {
        const model = (await (this.constructor as typeof Model).mongooseModel.findById(
            this.id
        )) as MongooseModel<any, any, any>
        const related = await model.populate([relation], options)
        return related[relation]
    }

    public async setRelated(relation: string, related: Model | Model[]): Promise<void> {
        const ids = Array.isArray(related) ? related.map((r) => r.id) : [related.id]
        await (this.constructor as typeof Model).mongooseModel.updateOne(
            { _id: this.id },
            { [relation]: ids }
        )
    }

    public static defineRelations(): void {}

    public static async get(id: string): Promise<Model> {
        const model = await (this as typeof Model).mongooseModel.findById(id)
        return model
    }

    public static async getAll(): Promise<Model[]> {
        const models = await (this as typeof Model).mongooseModel.find()
        return models.map((m) => m.toObject())
    }

    public static async query(query: string): Promise<any[]> {
        const { connection } = mongoose
        return connection.db.collection(this.collectionName()).find({}).toArray()
    }

    public static collectionName(): string {
        return (this as any).tableName()
    }

    protected static get mongooseModel(): MongooseModel<any, any, any> {
        const schema = (this as any).buildMongooseSchema()
        const modelName = (this as any).tableName()
        return mongoose.model(modelName, schema)
    }

    public static getSchema(): Schema {
        const schema = new Schema({
            _id: {
                type: Schema.Types.ObjectId,
            },
            created_at: {
                type: Date,
                required: true,
            },
            updated_at: {
                type: Date,
                required: true,
            },
        })

        const fields = this.getFields()

        Object.keys(fields).forEach((key) => {
            const field = fields[key]
            schema.add({
                [key]: field,
            })
        })
        return schema
    }

    public static getFields(): object {
        return {}
    }
}
