import express, { Router, Request, Response } from "express"
import { validationResult } from "express-validator"
import { loginUser, signUpUser } from "../controllers/auth.controller"
import { ApiResponse } from "./_response"
import { logInValidator, registerValidator } from "../middlewares/formValidation.middleware"

class AuthRouterClass extends ApiResponse {
    private router: Router

    constructor(express) {
        super()
        this.router = express.Router()
    }

    routes() {
        this.router.post("/login", logInValidator(), (req: Request, res: Response) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return this.errorResponse(res, errors.array(), "login_invalid_data_error")
            }
            loginUser(req.body)
                .then((apiResponse) => this.successResponse(res, apiResponse, "login_success"))
                .catch((apiError) => this.errorResponse(res, apiError, "login_error"))
        })

        this.router.post("/register", registerValidator(), (req: Request, res: Response) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return this.errorResponse(res, errors.array(), "register_invalid_data_error")
            }
            signUpUser(req.body)
                .then((apiResponse) => this.successResponse(res, apiResponse, "register_success"))
                .catch((apiError) => this.errorResponse(res, apiError, "register_error"))
        })
    }

    init() {
        this.routes()
        return this.router
    }
}

export { AuthRouterClass }
