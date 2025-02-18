import { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto} from "../../domain";
import { ProductService } from "../service/product.service";



export class ProductController {

    //ID
    constructor(
        private readonly productService: ProductService,
    ){}

    //Manejo Error personalizado
    private handleError = (error: unknown, res: Response) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
        }

        console.log(`${error}`);
        return res.status(500).json({error: 'Internal server error'});
    }

    createProduct = (req: Request, res: Response) => {

        const [error, createProductDto] = CreateProductDto.create( { 
            ...req.body, 
            user: req.body.user.id 
        }); //recibimos el user ID del token
        if(error) res.status(400).json({error});

        //Usamos el CategoryService
        this.productService.createProduct( createProductDto! )
            .then( product => res.status(201).json(product))
            .catch( error => this.handleError( error, res));

    }

    getProducts = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if( error ) return res.status(400).json({ error });

        // res.json(paginationDto);

        this.productService.getProducts( paginationDto! )
            .then( products => res.status(200).json( products ))
            .catch( error => this.handleError( error, res ));

    }

    //TODO:
    // getProductById = async(req: Request, res: Response) => {
    //     res.json('Get Product ID');
    // }
    // updateProduct = async(req: Request, res: Response) => {
    //     res.json('Update Product');
    // }
    // deleteProduct= async(req: Request, res: Response) => {
    //     res.json('Delete Product');
    // }

    
}