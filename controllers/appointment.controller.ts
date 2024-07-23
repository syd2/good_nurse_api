import { Request, Response } from "express"
import { Appointment, IAppointment } from "../models/appointment.model"
import { Nurse } from "../models/nurse.model"
import { Patient } from "../models/patient.model"

export const createAppointment = (appointmentData: any): Promise<IAppointment> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { patient, nurse, date, start_time, end_time, location, notes } = appointmentData

            // Vérifier si le patient et l'infirmier existent
            const nurseExists = await Nurse.findById(nurse)
            const patientExists = await Patient.findById(patient)

            if (!nurseExists) {
                return reject({ message: "L'infirmier n'existe pas" })
            }

            if (!patientExists) {
                return reject({ message: "Le patient n'existe pas" })
            }

            // Vérifier la disponibilité de l'infirmier pour le créneau demandé
            const isAvailable = await Appointment.isTimeSlotAvailable(
                nurse,
                date,
                start_time,
                end_time
            )

            if (!isAvailable) {
                return reject({ message: "Le créneau horaire est déjà occupé" })
            }

            // Créer le rendez-vous
            const newAppointment = new Appointment({
                patient,
                nurse,
                date,
                start_time,
                end_time,
                location,
                notes,
            })

            await newAppointment.save()
            resolve(newAppointment)
        } catch (error) {
            reject(error)
        }
    })
}

export const updateAppointment = (
    appointmentId: string,
    updateData: any
): Promise<IAppointment> => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedAppointment = await Appointment.findByIdAndUpdate(
                appointmentId,
                updateData,
                { new: true }
            )
            if (!updatedAppointment) {
                return reject({ message: "Rendez-vous non trouvé" })
            }
            resolve(updatedAppointment)
        } catch (error) {
            reject(error)
        }
    })
}

export const cancelAppointment = (appointmentId: string): Promise<IAppointment> => {
    return new Promise(async (resolve, reject) => {
        try {
            const cancelledAppointment = await Appointment.findByIdAndUpdate(
                appointmentId,
                { status: "cancelled" },
                { new: true }
            )
            if (!cancelledAppointment) {
                return reject({ message: "Rendez-vous non trouvé" })
            }
            resolve(cancelledAppointment)
        } catch (error) {
            reject(error)
        }
    })
}
