import express, { Router, Request, Response } from "express"
import {
    createAppointment,
    updateAppointment,
    cancelAppointment,
} from "../controllers/appointment.controller"
import { ApiResponse } from "./_response"

class AppointmentRouterClass extends ApiResponse {
    private router: Router

    constructor(express) {
        super()
        this.router = express.Router()
    }

    routes() {
        this.router.post("/", (req: Request, res: Response) => {
            createAppointment(req.body)
                .then((apiResponse) =>
                    this.successResponse(res, apiResponse, "appointment_created")
                )
                .catch((apiError) =>
                    this.errorResponse(res, apiError, "appointment_creation_error")
                )
        })

        this.router.put("/:id", (req: Request, res: Response) => {
            updateAppointment(req.params.id, req.body)
                .then((apiResponse) =>
                    this.successResponse(res, apiResponse, "appointment_updated")
                )
                .catch((apiError) => this.errorResponse(res, apiError, "appointment_update_error"))
        })

        this.router.delete("/:id", (req: Request, res: Response) => {
            cancelAppointment(req.params.id)
                .then((apiResponse) =>
                    this.successResponse(res, apiResponse, "appointment_cancelled")
                )
                .catch((apiError) =>
                    this.errorResponse(res, apiError, "appointment_cancellation_error")
                )
        })
    }

    init() {
        this.routes()
        return this.router
    }
}

export { AppointmentRouterClass }
