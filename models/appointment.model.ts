import { Schema, model, Types } from "mongoose"
import { CrudService, IModel } from "../services/CrudService"

interface IAppointment extends IModel {
    patient: Types.ObjectId
    nurse: Types.ObjectId
    date: Date
    start_time: string
    end_time: string
    status: "scheduled" | "completed" | "cancelled"
    location: string
    notes: string
    created_at: Date
    updated_at: Date
}

const appointmentSchema = new Schema<IAppointment>({
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    nurse: { type: Schema.Types.ObjectId, ref: "Nurse", required: true },
    date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
    location: { type: String, required: true },
    notes: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
})

const Appointment = model<IAppointment>("Appointment", appointmentSchema)
const AppointmentService = new CrudService(Appointment)

export { Appointment, AppointmentService, IAppointment }
