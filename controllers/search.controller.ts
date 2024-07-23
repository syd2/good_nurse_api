import { Request, Response } from "express"
import { Nurse } from "../models/nurse.model"

export const searchNurses = (
    queryParams: any
): Promise<{ nurses: any[]; totalResults: number; totalPages: number; currentPage: number }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                address,
                specializations,
                min_experience,
                max_experience,
                service_area,
                available_days,
                available_times,
                page = 1,
                limit = 10,
            } = queryParams

            if (!address || !specializations) {
                return reject({
                    message: "Les paramètres adresse et spécialisation sont obligatoires",
                })
            }

            // Construire les critères de recherche
            const searchCriteria: any = {
                service_area: { $in: address.split(",") },
                specializations: { $in: specializations.split(",") },
            }

            if (min_experience || max_experience) {
                searchCriteria.years_of_experience = {}
                if (min_experience) {
                    searchCriteria.years_of_experience.$gte = Number(min_experience)
                }
                if (max_experience) {
                    searchCriteria.years_of_experience.$lte = Number(max_experience)
                }
            }

            if (service_area) {
                searchCriteria.service_area = { $in: service_area.split(",") }
            }

            if (available_days || available_times) {
                searchCriteria.available_hours = {}
                if (available_days) {
                    searchCriteria.available_hours.day = { $in: available_days.split(",") }
                }
                if (available_times) {
                    searchCriteria.available_hours.time = { $in: available_times.split(",") }
                }
            }

            const pageNum = parseInt(page as string, 10)
            const limitNum = parseInt(limit as string, 10)
            const skip = (pageNum - 1) * limitNum

            // Effectuer la recherche dans la base de données avec pagination
            const nurses = await Nurse.find(searchCriteria).skip(skip).limit(limitNum)

            // Obtenir le nombre total de résultats
            const totalResults = await Nurse.countDocuments(searchCriteria)

            resolve({
                nurses,
                totalResults,
                totalPages: Math.ceil(totalResults / limitNum),
                currentPage: pageNum,
            })
        } catch (error) {
            reject(error)
        }
    })
}
