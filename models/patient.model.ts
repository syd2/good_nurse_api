import { Schema, model, Types } from "mongoose"
import { IUser, User } from "./user.model"
import { CrudService } from "../services/CrudService"

interface IPatient extends IUser {
    emergency_contact: {
        name: string
        phone: string
        relationship: string
    }
    preferred_language: string
    appointments: Types.ObjectId[]
}

const patientSchema = new Schema<IPatient>({
    emergency_contact: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        relationship: { type: String, required: true },
    },
    preferred_language: { type: String, default: "French" },
    appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
})

const Patient = User.discriminator<IPatient>("Patient", patientSchema)
const PatientService = new CrudService(Patient)

export { Patient, PatientService, IPatient }
