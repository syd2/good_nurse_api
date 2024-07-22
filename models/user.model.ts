import { Schema, model, Types } from "mongoose"
import { CrudService, IModel } from "../services/CrudService"
import jwt from "jsonwebtoken"

interface IUser extends IModel {
    first_name: string
    last_name: string
    email: string
    phone: string
    password: string
    role: "patient" | "nurse" | "admin"
    profile_picture?: string
    address: string
    city: string
    postal_code: string
    country: string
    date_of_birth: Date
    gender: "male" | "female" | "other"
    account_status: "active" | "inactive" | "suspended"
    last_login: Date
    created_at: Date
    updated_at: Date
    generateJWT: any
}

const userSchema = new Schema<IUser>({
    first_name: { type: String, required: true, trim: true, maxlength: 255 },
    last_name: { type: String, required: true, trim: true, maxlength: 255 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "nurse", "admin"], required: true },
    profile_picture: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    account_status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    last_login: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
})

userSchema.methods.generateJWT = function () {
    const expiryToken = new Date()
    expiryToken.setDate(expiryToken.getDate() + 7) // Token valide pour 7 jours
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role,
            exp: parseInt((expiryToken.getTime() / 1000).toString(), 10),
        },
        process.env.JWT_SECRET
    )
}

const User = model<IUser>("User", userSchema)
const UserService = new CrudService(User)

export { User, UserService, IUser }
