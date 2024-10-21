import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto} from "../../domain";
import { CategoryService } from "../service/category.service";



export class CategoryController {

    //ID
    constructor(
        // public readonly authService: AuthService,
        private readonly categoryService: CategoryService,
    ){}

    //Manejo Error personalizado
    private handleError = (error: unknown, res: Response) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
        }

        console.log(`${error}`);
        return res.status(500).json({error: 'Internal server error'});
    }

    createCategory = (req: Request, res: Response) => {

        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
        if(error) res.status(400).json({error});

        //Usamos el CategoryService
        this.categoryService.createCategory(createCategoryDto!, req.body.user )
            .then( category => res.status(201).json(category))
            .catch( error => this.handleError( error, res));
    }

    getCategories = (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if( error ) return res.status(400).json({ error });

        // res.json(paginationDto);

        this.categoryService.getCategories( paginationDto! )
            .then( categories => res.status(200).json( categories ))
            .catch( error => this.handleError( error, res ));
    }

    //TODO:
    // getCategoryById = async(req: Request, res: Response) => {
    //     res.json('Get Category ID');
    // }
    // updateCategory = async(req: Request, res: Response) => {
    //     res.json('Update Category');
    // }
    // deleteCategory = async(req: Request, res: Response) => {
    //     res.json('Delete Category');
    // }

    
}