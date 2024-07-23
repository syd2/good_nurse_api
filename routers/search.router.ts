import express, { Router, Request, Response } from "express"
import { searchNurses } from "../controllers/search.controller"
import { ApiResponse } from "./_response"

class SearchRouterClass extends ApiResponse {
    private router: Router

    constructor(express) {
        super()
        this.router = express.Router()
    }

    routes() {
        this.router.get("/nurses", (req: Request, res: Response) => {
            searchNurses(req.query)
                .then((apiResponse) => this.successResponse(res, apiResponse, "search_success"))
                .catch((apiError) => this.errorResponse(res, apiError, "search_error"))
        })
    }

    init() {
        this.routes()
        return this.router
    }
}

export { SearchRouterClass }
