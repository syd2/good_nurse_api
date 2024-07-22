import { Schema, model, Types } from "mongoose"
import { IUser, User } from "./user.model"
import { CrudService } from "../services/CrudService"

interface INurse extends IUser {
    license_number: string
    specializations: string[]
    years_of_experience: number
    available_hours: {
        day: string
        start: string
        end: string
    }[]
    service_area: string[]
    rating: number
    appointments: Types.ObjectId[]
}

const nurseSchema = new Schema<INurse>({
    license_number: { type: String, required: true, unique: true },
    specializations: [{ type: String }],
    years_of_experience: { type: Number, required: true },
    available_hours: [
        {
            day: {
                type: String,
                enum: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
            },
            start: String,
            end: String,
        },
    ],
    service_area: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
})

const Nurse = User.discriminator<INurse>("Nurse", nurseSchema)
const NurseService = new CrudService(Nurse)

export { Nurse, NurseService, INurse }
