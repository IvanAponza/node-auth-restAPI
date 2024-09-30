import mongoose from "mongoose";



export interface Options {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {

    static async connect( options: Options ){

        const { mongoUrl, dbName } = options;

        try {
            await mongoose.connect(mongoUrl, {dbName})

            // console.log('Mongo conneted')
            return true;
        } catch (error) {
            console.log('Mongo Connection Error')
        }
    }
}