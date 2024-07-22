import mongoose from "mongoose"

export class MongoClass {
    public mongoUrl

    constructor() {
        this.mongoUrl = process.env.MONGO_URL
    }

    connectDb() {
        return new Promise((resolve, reject) => {
            mongoose
                .connect(this.mongoUrl)
                .then((db: any) => resolve({ db, url: this.mongoUrl }))
                .catch((dbError: any) => reject(dbError))
        })
    }
}
