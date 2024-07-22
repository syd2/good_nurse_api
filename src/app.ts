import express from "express"
import passport from "passport"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { MongoClass } from "../services/mongo"
import { RouterClass } from "../routers/api.router"
import { AuthRouterClass } from "../routers/auth.router"
import { setAuthentication } from "../services/passport"
require("dotenv").config()

let isConnected = false

class ServerClass {
    public port: any
    public server: any
    public mongDb: any
    constructor() {
        this.server = express()
        this.port = process.env.APP_PORT || 8080
        this.mongDb = new MongoClass()
    }

    async init() {
        const allowedOrigins = process.env.ALLOWED_ORIGINS.split(";")
        const options: cors.CorsOptions = {
            origin: allowedOrigins,
            credentials: true,
        }

        this.server.use(cors(options))
        this.server.use(cookieParser())
        this.server.use(express.json({ limit: "20mb" }))
        this.server.use(express.urlencoded({ extended: true }))
        this.connectDb()
        this.config()
    }

    config() {
        const apiRouter = new RouterClass(express)
        const authRouterClass = new AuthRouterClass(express)
        setAuthentication(passport)

        this.server.use("/v1", apiRouter.init())
        this.server.use("/v1/auth", authRouterClass.init())
        // this.server.use("/v1/uploads", express.static("uploads"))

        this.server.use((_req, res, _next) => {
            return res.status(404).json({
                success: false,
                data: null,
                err: "not_found",
                message: "Page not found",
                version: "v1.0",
                status_code: 404,
            })
        })

        this.server.use(helmet())
    }

    connectDb() {
        this.mongDb
            .connectDb()
            .then((db) => {
                this.server.listen(this.port, () => {
                    console.log({
                        node: `http://localhost:${this.port}`,
                        db: db.url,
                    })
                })
            })
            .catch((dbError: any) => {
                console.log(dbError)
            })
    }
}

const MyServer = new ServerClass()
MyServer.init()

export { MyServer }
