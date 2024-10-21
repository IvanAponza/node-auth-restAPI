import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";



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
    
    async getCategories(paginationDto: PaginationDto){

        const { page, limit } = paginationDto;

        try {
            
            // const total = await CategoryModel.countDocuments();
            // const categories = await CategoryModel.find()
            //     .skip( (page - 1) * limit )//salta una cantidad de regist (0 - limit)
            //     .limit( limit )//trae cant reg deseado

            const [ total, categories ] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);

                
                // return categories.map( category => ({
                //     id: category.id,
                //     name: category.name,
                //     available: category.available,
                // }));
                    
                // Forma Implicita
                // return categories.map(({id, name, available}) => ({id,name, available}));

                //Colocamos la res en un ojeto
                return {
                    page: page,
                    limit: limit,
                    total: total,
                    next: `/api/categories?page=${( page + 1)}&limit=${ limit}`,
                    prev: (page - 1 > 0 ) ? `/api/categories?page=${( page - 1)}&limit=${ limit}`: null,

                    // categories: categories.map( category => ({
                    //     id: category.id,
                    //     name: category.name,
                    //     available: category.available,
                    // }))  
                    
                    categories: categories.map(({id, name, available}) => ({id,name, available}))
                }
                
        } catch (error) {
            throw CustomError.InternalServer('Internal Server Error')
        }
    }
}