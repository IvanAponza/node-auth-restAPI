import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, UserEntity } from "../../domain";



export class CategoryService{

    constructor(){}

    async createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity ){

        const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
        if( categoryExists ) throw CustomError.badRequest('Category already exists');

        try {

            const category = new CategoryModel({...createCategoryDto, user: user.id});

            await category.save();

            //retornamos solo los datos que vamos a trabajar
            return {
               id: category.id,
               name: category.name,
               available: category.available, 
            }
            
        } catch (error) {
            throw CustomError.InternalServer(`${ error }`);
        }
    }
    
    async getCategories(){

        try {
            
            const categories = await CategoryModel.find()
    
            return categories.map( category => ({
                id: category.id,
                name: category.name,
                available: category.available,
            }));
    
            // Forma Implicita
            // return categories.map(({id, name, available}) => ({id, name, available}));
        } catch (error) {
            throw CustomError.InternalServer('Internal Server Error')
        }
    }
}