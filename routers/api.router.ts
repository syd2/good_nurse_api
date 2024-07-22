import { body } from "express-validator"
import { ApiResponse } from "./_response"

class RouterClass extends ApiResponse {
    private router
    constructor(express) {
        super()
        this.router = express.Router()
    }

    routes() {
        this.router.get("/", (req, res) => {
            return this.successResponse(res, {}, "Hello API")
        })
    }

    init() {
        this.routes()
        return this.router
    }
}

export { RouterClass }
