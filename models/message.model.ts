import { Schema, model, Types } from "mongoose"
import { CrudService, IModel } from "../services/CrudService"

interface IMessage extends IModel {
    sender: Types.ObjectId
    recipient: Types.ObjectId
    content: string
    read: boolean
    created_at: Date
    conversation_id: string // Identifiant unique pour chaque conversation
}

const messageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    conversation_id: { type: String, required: true },
})

// Index pour optimiser les requêtes de recherche de messages par conversation
messageSchema.index({ conversation_id: 1, created_at: -1 })

const Message = model<IMessage>("Message", messageSchema)
const MessageService = new CrudService(Message)

export { Message, MessageService, IMessage }
