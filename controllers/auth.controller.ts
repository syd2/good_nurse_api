import { User, IUser } from "../models/user.model"
import { Nurse, INurse } from "../models/nurse.model"
import { Patient, IPatient } from "../models/patient.model"
import bcrypt from "bcryptjs"
import escape from "escape-html"

export const signUpUser = (
    userData: any
): Promise<{ token: string; user: IUser | INurse | IPatient }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                first_name,
                last_name,
                email,
                phone,
                password,
                role,
                address,
                city,
                postal_code,
                country,
                date_of_birth,
                gender,
            } = userData

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await User.findOne({ $or: [{ email }, { phone }] })
            if (existingUser) {
                return reject({ message: "Cet email ou ce numéro de téléphone est déjà utilisé" })
            }

            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10)

            const profile_picture = role === "patient" ? "assets/patient.png" : "assets/nurse.png"

            // Créer un nouvel utilisateur
            const newUserData: Partial<IUser> = {
                first_name: escape(first_name),
                last_name: escape(last_name),
                email: escape(email),
                phone: escape(phone),
                password: hashedPassword,
                role,
                address: escape(address),
                city: escape(city),
                postal_code: escape(postal_code),
                profile_picture: escape(profile_picture),
                country: escape(country),
                date_of_birth: new Date(date_of_birth),
                gender,
            }

            let newUser

            if (role === "nurse") {
                const {
                    license_number,
                    specializations,
                    years_of_experience,
                    available_hours,
                    service_area,
                } = userData

                const nurseData: any = {
                    ...newUserData,
                    license_number: escape(license_number),
                    specializations: specializations.map(escape),
                    years_of_experience,
                    available_hours,
                    service_area: service_area.map(escape),
                }
                newUser = new Nurse(nurseData)
            } else if (role === "patient") {
                const { emergency_contact, preferred_language } = userData

                const patientData: any = {
                    ...newUserData,
                    emergency_contact,
                    preferred_language: escape(preferred_language),
                }
                newUser = new Patient(patientData)
            } else {
                return reject({ message: "Rôle invalide" })
            }

            await newUser.save()

            // Générer un token JWT
            const token = newUser.generateJWT()

            resolve({ token, user: newUser })
        } catch (error) {
            reject(error)
        }
    })
}

export const loginUser = (
    loginData: any
): Promise<{ token: string; user: IUser | INurse | IPatient }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, password } = loginData

            // Vérifier si l'utilisateur existe
            const user = await User.findOne({ email })
            if (!user) {
                return reject({ message: "Email ou mot de passe incorrect" })
            }

            // Vérifier le mot de passe
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return reject({ message: "Email ou mot de passe incorrect" })
            }

            // Générer un token JWT
            const token = user.generateJWT()

            resolve({ token, user })
        } catch (error) {
            reject(error)
        }
    })
}
