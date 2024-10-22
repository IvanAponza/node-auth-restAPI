import { envs } from "../../config";
import { CategoryModel } from "../mongo/models/category-model";
import { ProductModel } from "../mongo/models/product-model";
import { UserModel } from "../mongo/models/user-model";
import { MongoDatabase } from "../mongo/mondo-database";
import { seedData } from "./data";



(async()=> {

    await MongoDatabase.connect({
      mongoUrl: envs.MONGO_URL,
      dbName: envs.MONGO_DB_NAME,
    })

    await main();

    await MongoDatabase.disconnect();

})();

//Funtion para rellenar user en la category and product
const randomBetween0Andx = ( x: number ) => {
    return Math.floor( Math.random() * x ); //0 - 5, 1 - 10 ejemp.
}
  
async function main() {

    //0. Borrar todo
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),

    ]);
  
    //1. Crear Usuarios
    const users = await UserModel.insertMany( seedData.users );

    //2. Crear Categorias
    const categories = await CategoryModel.insertMany(
        seedData.categories.map( category => {

            return {
                ...category,
                user: users[0]._id,
            }
        })
    );

    //3. Crear Productos
    const products = await ProductModel.insertMany(
        seedData.products.map( product => {

            return {
                ...product,
                //add user and category aleatorio a cada product
                user: users[randomBetween0Andx(seedData.users.length - 1) ]._id,
                category: categories[randomBetween0Andx(seedData.categories.length - 1)]._id,
            }
        })
    );

    console.log('[APP] ...SEEDED');

}